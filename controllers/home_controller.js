const fileController = require('./file_controller');
// const CsvFile = require('../model/csv_model');

const uploadedFileNames = fileController.uploadedFileNames;
const array = uploadedFileNames();   //array containing the csv filenames
console.log('value of array',array);

module.exports.home =async function(req,res){
    try{
        // CsvFileRecords = await CsvFile.find({});
        console.log("javid");
    return res.render('home',{
        title: "csv project",
        file_list : array,
    }
    );
    }catch(err){
        console.log(err);
    }
    
}
