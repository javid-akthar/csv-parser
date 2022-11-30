var mongoose = require('mongoose');
  
var csvFileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    csvFile:
    {
        data: Buffer,
        contentType: String,
        // required: true
    },
    jsonObj:{
        type: String
    }
},
{
    timestamps: true,
});

//Image is a model which has a schema imageSchema
const CsvFile = mongoose.model('CsvFile', csvFileSchema);
  
module.exports = CsvFile;