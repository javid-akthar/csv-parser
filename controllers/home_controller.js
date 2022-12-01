const fileController = require('./file_controller');

const uploadedFileArray = fileController.uploadedFileArray;
const arrayofFiles = uploadedFileArray();   

module.exports.home =async function(req,res){
    try{
    return res.render('home',{
        title: "csv parser",
        file_list : arrayofFiles,
    }
    );
    }catch(err){
        console.log(err);
    }
    
}
