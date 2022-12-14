const multer = require('multer');
const ejs = require('ejs');
const fs = require('fs');
var iconv = require('iconv-lite');

// papaparse library to parse the csv file and convert to json object array
const Papa = require('papaparse');

// the names of files will be stored in this array
const uploadedFileArray = [];

// if a csv filed is parsed it will be stored in this set to use this for sorting and search functionalities
const parsedSet = new Map();

// if a parsed array is sorted in ascending or descending order the subsequent asc/desc
//  functionalities will be triggered in already sorted jspn module so the previous sort will be saved
const descAscCache = new Map();

// if a search function is triggered before sort function, the sort need to be performed in search result obj
// so we are storing the search result in this map
const searchResultMap = new Map();
const path = require('path');

// to store the files names
module.exports.uploadedFileArray = function () {
    return uploadedFileArray;
}

// multer for processing uploaded files
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename: function (req, file, cb) {
        console.log("file.fieldname + '-' + Date.now()", file.fieldname + '-' + Date.now());
        console.log(file.originalname);
        // modifying the file name and storing in uploads folder
        cb(null, file.originalname + '-' + Date.now())
    }
});

// to accept only .csv file, this will take care
var fileFilter = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== '.csv') {
        console.log('the uploaded files is csv format')
        return callback(new Error('the uploaded file is not in csv format'))
    }
    callback(null, true)
}


// multer object
var upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('uploaded_file');

// controller for uploading the files and storing in the uploads part
module.exports.upload = function (req, res) {
    try {
        console.log("inside uploadController");
        console.log(path.join(__dirname, '../uploads'));
        upload(req, res, (err) => {
            const file = req.file
            if (err) {
                console.log('err', err);
                return res.redirect('/');
            }

            console.log('req.file.filename', req.file.filename)
            // the names of files will be stored in this array
            uploadedFileArray.push(req.file.filename);
            return res.redirect('/');

        }
        )
    } catch (err) {
        console.log('error in upload controller');
        console.log(err);
    }
}


// controller for converting csv format file to json obj and convert it into table rows
module.exports.open = function (req, res) {

    try {
        console.log("inside openController");
        const csvParsedData = [];
        const id = req.query.id;
        console.log('id', id);
        const pathOfFile = path.join(__dirname, '../uploads', uploadedFileArray[id]);
        console.log('pathOfFile', pathOfFile);
        const buffer = fs.readFileSync(pathOfFile);

        let dataString = iconv.decode(buffer, 'win1251');

        let config = {
            header: true,
            dynamicTyping: true


        };
        // using papaparse to parse the csv file to json object
        const parsedOutput = Papa.parse(dataString, config);
        jsonData = parsedOutput.data;
        jsonData.pop();
        let searchResultArray = new Array(jsonData.length).fill(true);
        searchResultMap.set(id, searchResultArray);
        // storing the parsed data in set to use it for future sort and search functionality
        parsedSet.set(id, jsonData);
        descAscCache.set(id, {});
        // rendering the table with parsed json object
        return res.render('tabular-data-view', {
            title: "csv parser",
            jsonData: jsonData,
            id,
            searchResultArray
        });
    } catch (err) {
        console.log('error in open controller');
        console.log(err);
    }
}

// controller for sorting the data column wise with the column selected
module.exports.sortArray = async function (req, res) {
    try {
        console.log("reached sortArray controller");
        colName = req.body.colName;
        id = req.body.id;
        jsonData = parsedSet.get(req.body.id);
        descAsc = descAscCache.get(id);
        // logic to sort in asc/desc based upon the requirement
        if (!descAsc.hasOwnProperty(colName)) {
            descAsc[colName] = true;
        } else if (descAsc.hasOwnProperty(colName)) {
            descAsc[colName] = !descAsc[colName];
        }
        if (descAsc[colName]) {
            jsonData = jsonData.sort((a, b) => a[colName] > b[colName] ? 1 : -1)
        }
        if (!descAsc[colName]) {
            jsonData = jsonData.sort((a, b) => a[colName] < b[colName] ? 1 : -1)
        }
        parsedSet.set(id, jsonData);
        // if a search function is triggered before sort function, the sort need to be performed in search result obj
        // so we are storing the search result in this map
        searchResultArray = searchResultMap.get(id);
        // will send the new json Obj to table_data.ejs and will update the DOM
        // with new table
        let html = await ejs.renderFile(path.join(__dirname, '../views/table_data.ejs'), {
            jsonData: jsonData,
            searchResultArray: searchResultArray
        });
        if (req.xhr) {
            return res.status(200).json({
                data: {
                    html
                },
                message: "modifiedTableRecord!"
            });
        }
    } catch (err) {
        console.log('error in open controller');
        console.log(err);
    }

}

// controller for searching with keyword in jsob obj and onl show the filtered result
module.exports.searchArray = async function (req, res) {
    try {
        console.log("reached searchArray controller")
        searchKey = req.body.searchKey.toLowerCase()
        id = req.body.id
        console.log('searchKey', searchKey)
        console.log('id', id);

        // if a csv filed is parsed it will be stored in this set to use this for sorting 
        // and search functionalities and later we will use this for seraching
        jsonData = parsedSet.get(id);
        let searchResultArray = searchResultMap.get(id);
        for (let i = 0; i < jsonData.length; i++) {
            let obj = jsonData[i];
            let objSize = Object.keys(obj).length;
            let count = 0;
            // for loop to traverse over each object and every field in a object and find the matching 
            // obj based upon the input search key
            for (property in obj) {
                count++;
                // if(obj[property]){
                result = false;
                try {
                    result = obj[property].toString().toLowerCase().includes(searchKey)
                } catch (err) {
                }
                if (result) {
                    searchResultArray[i] = true
                    break;
                } else {
                    if (count == objSize) {
                        searchResultArray[i] = false
                    }
                }
                // }

            }
        }
        // console.log(path(__dirname));
        let ejsFilePath =  path.join(__dirname, '../views/table_data.ejs');
        let dirpath = path.join(__dirname);
        console.log('ejsFilePath',ejsFilePath);
        console.log('dirpath',dirpath);
        // will send the new json Obj to table_data.ejs and will update the DOM
        // with new table
        let html = await ejs.renderFile(path.join(__dirname, '../views/table_data.ejs'), {
            jsonData: jsonData,
            searchResultArray: searchResultArray
        });
        if (req.xhr) {
            return res.status(200).json({
                data: {
                    html
                },
                message: "modifiedTableRecord!"
            });
        }
    } catch (err) {
        console.log('error in searchArray controller');
        console.log(err);
    }
}

// controller for deleting the files
module.exports.delete = function (req, res) {
    // delete the selected file in the uploads folder
    try {
        let id = req.query.id;
        let files = fs.readdirSync(path.join(__dirname, '..', '/uploads'));
        if (files.length > 0) {
            var filePath = path.join(__dirname, '..', '/uploads', uploadedFileArray[id]);
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
        }
        // updating the uploadedFileArray after deletion
        uploadedFileArray.splice(id, 1);
        // updating the parsedSet set after deletion
        parsedSet.delete(id)
        // updating the descAscCache set after deletion
        descAscCache.delete(id)
        // updating the searchResultMap set after deletion
        searchResultMap.delete(id)
        return res.redirect('back');
    } catch (err) {
        console.log('error in delete controller');
        console.log(err);
    }

}