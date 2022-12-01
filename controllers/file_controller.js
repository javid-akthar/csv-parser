// SET STORAGE
const multer = require('multer');
const csvToJson = require('convert-csv-to-json');
// const CsvFile = require('../model/csv_model');
const ejs = require('ejs');
const fs = require('fs');
var iconv = require('iconv-lite');
const Papa = require('papaparse');
const uploadedFileNames = [];
const parsedSet = new Map();
const descAscCache = new Map();
const searchResultMap = new Map();

module.exports.uploadedFileNames = function () {
    return uploadedFileNames;
}

path = require('path')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename: function (req, file, cb) {
        console.log("file.fieldname + '-' + Date.now()", file.fieldname + '-' + Date.now());
        console.log(file.originalname);
        cb(null, file.originalname + '-' + Date.now())
    }
});

var fileFilter = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== '.csv') {
        console.log('file is not csv type')
        return callback(new Error('Only csv format files are allowed'))
    }
    callback(null, true)
}

var upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('uploaded_file');

module.exports.upload = function (req, res) {
    try {
        console.log(req.file);
        console.log("inside multer");
        console.log(path.join(__dirname, '../uploads'));
        upload(req, res, (err) => {
            console.log("inside multer2");
            const file = req.file
            if (err) {
                console.log('err', err);
                return res.redirect('/');
            }

            console.log('req.file.filename', req.file.filename)
            uploadedFileNames.push(req.file.filename);
            console.log('uploadedFileNamesArray', uploadedFileNames)
            return res.redirect('/');

        }
        )
    } catch (err) {
        console.log('error in upload controller');
        console.log(err);
    }
}



module.exports.open = function (req, res) {

    try {
        console.log("line1");
        const csvParsedData = [];              //array which stores the data in JSON format
        const id = req.query.id;
        const pathOfFile = path.join(__dirname, '../uploads', uploadedFileNames[id]);

        const buffer = fs.readFileSync(pathOfFile);

        let dataString = iconv.decode(buffer, 'win1251');

        // parse string to array of objects
        console.log("line2");
        let config = {
            // worker: true,
            header: true,
            dynamicTyping: true


        };
        console.log("line3");
        const parsedOutput = Papa.parse(dataString, config);
        jsonData = parsedOutput.data;
        jsonData.pop();
        console.log('length of array', jsonData.length);
        let searchResultArray = new Array(jsonData.length).fill(true);
        searchResultMap.set(id, searchResultArray);
        console.log("line4");

        console.log("line5");
        parsedSet.set(id, jsonData);
        descAscCache.set(id, {});
        return res.render('tabular-data-view', {
            title: "csv project",
            jsonData: jsonData,
            id,
            searchResultArray
        });
        console.log("line6");
    } catch (err) {
        console.log('error in open controller');
        console.log(err);
    }
}

module.exports.sortArray = async function (req, res) {
    try {
        console.log("reached sortArray controller");
        console.log(req.body.colName);
        console.log(req.body);
        console.log(req.body.id);
        colName = req.body.colName;
        id = req.body.id;
        jsonData = parsedSet.get(req.body.id);
        descAsc = descAscCache.get(id);
        if (!descAsc.hasOwnProperty(colName)) {
            descAsc[colName] = true;
        } else if (descAsc.hasOwnProperty(colName)) {
            descAsc[colName] = !descAsc[colName];
        }
        // console.log('beforejsonData',jsonData);
        if (descAsc[colName]) {
            jsonData = jsonData.sort((a, b) => a[colName] > b[colName] ? 1 : -1)
        }
        if (!descAsc[colName]) {
            jsonData = jsonData.sort((a, b) => a[colName] < b[colName] ? 1 : -1)
        }
        // console.log('afterjsonData',jsonData);
        parsedSet.set(id, jsonData);
        searchResultArray = searchResultMap.get(id);
        let html = await ejs.renderFile(__dirname + '../../views/table_data.ejs', {
            jsonData: jsonData,
            searchResultArray: searchResultArray
        });
        // console.log('value of html', html);
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

module.exports.searchArray = async function (req, res) {
    console.log("reached searchArray controller")
    searchKey = req.body.searchKey.toLowerCase()
    id = req.body.id
    console.log('searchKey', searchKey)
    console.log('id', id)
    // let obj1 = {
    //     a : "b"
    // }
    // console.log(typeof(obj1))
    // console.log(obj1["a"].indexOf("a"));
    // console.log(obj1["a"].indexOf("b"));
    // console.log('jsonDatabefore',jsonData)

    jsonData = parsedSet.get(id);
    let searchResultArray = searchResultMap.get(id);
    console.log('jsonDatabefore', searchResultArray)
    for (let i = 0; i < jsonData.length; i++) {
        let obj = jsonData[i];
        let objSize = Object.keys(obj).length;
        console.log('objSize', objSize);
        let count = 0;
        for (property in obj) {
            count++;
            // console.log(property," ",obj[property]);
            result = obj[property].toString().toLowerCase().includes(searchKey)

            console.log(result, " ", count);
            if (result) {
                // obj.showOrNot = true
                searchResultArray[i] = true
                break;
            } else {
                if (count == objSize) {
                    searchResultArray[i] = false
                }
            }
        }
    }
    console.log('jsonDataafter', searchResultArray)
    // console.log('jsonDataAfter',jsonData);
    let html = await ejs.renderFile(__dirname + '../../views/table_data.ejs', {
        jsonData: jsonData,
        searchResultArray: searchResultArray
    });
    // console.log('value of html', html);
    if (req.xhr) {
        return res.status(200).json({
            data: {
                html
            },
            message: "modifiedTableRecord!"
        });
    }
}

module.exports.delete = function (req, res) {
    let id = req.query.id;
    try { var files = fs.readdirSync(path.join(__dirname, '..', '/uploads')); }
    catch (e) { return; }
    if (files.length > 0) {
        var filePath = path.join(__dirname, '..', '/uploads', uploadedFileNames[id]);
        if (fs.statSync(filePath).isFile())
            fs.unlinkSync(filePath);
    }
    uploadedFileNames.splice(id, 1);
    parsedSet.delete(id)
    descAscCache.delete(id)
    searchResultMap.delete(id)
    return res.redirect('back');
}