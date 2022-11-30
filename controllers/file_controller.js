// SET STORAGE
const multer = require('multer');
const csvToJson = require('convert-csv-to-json');
// const CsvFile = require('../model/csv_model');
const fs = require('fs');
    var iconv = require('iconv-lite');
    const Papa = require('papaparse');
const uploadedFileNames = []; 
module.exports.uploadedFileNames = function(){
    return uploadedFileNames;
  } 

path = require('path')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../uploads'))
    },
    filename: function (req, file, cb) {
        console.log("file.fieldname + '-' + Date.now()",file.fieldname + '-' + Date.now());
        console.log(file.originalname);
        cb(null, file.originalname + '-' + Date.now())
    }
});

var fileFilter = function(req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.csv') {
        console.log('file is not csv type')
        return callback(new Error('Only csv format files are allowed'))
    }
    callback(null, true)
}

var upload = multer({ storage: storage,
    fileFilter : fileFilter
}).single('uploaded_file');

module.exports.upload = function (req, res) {
    console.log(req.file);
    console.log("inside multer");
    console.log(path.join(__dirname,'../uploads'));
    upload(req, res, (err) => {
        console.log("inside multer2");
        const file = req.file
        if(err){
            console.log('err',err);
            return res.redirect('/');
        }
       
        console.log('req.file.filename',req.file.filename)
        uploadedFileNames.push(req.file.filename);
        console.log('uploadedFileNamesArray',uploadedFileNames)
        return res.redirect('/');
       
        }
    )
}


    
module.exports.open = function(req,res){

    try{
        console.log("line1");
        const csvParsedData = [];              //array which stores the data in JSON format
    const id = req.query.id;
    const pathOfFile = path.join(__dirname,'../uploads',uploadedFileNames[id]);
   
   const buffer = fs.readFileSync(pathOfFile);
   
   let dataString = iconv.decode(buffer, 'win1251'); 
   
   // parse string to array of objects
   console.log("line2");
   let config = {
        // worker: true,
       header: true,
    //    dynamicTyping: true
   
       
   };
   console.log("line3");
   const parsedOutput = Papa.parse(dataString, config);
    jsonData = parsedOutput.data;
    console.log("line4");
    jsonData.pop();
    console.log("line5");
    return res.render('tabular-data-view',{
        title: "csv project",
        jsonData:jsonData
    });
    console.log("line6");
    }catch(err){
        console.log('error in open controller');
        console.log(err);
    }
    
  }