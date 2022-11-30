const express = require('express');  
const port = 8002;
const fs = require('fs');
const path = require('path');
const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const ejs = require('ejs');
const db = require('./config/mongoose');



const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayout);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('assets')); 
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use('/',require('./routes/index')); 

app.listen(port,function(err){
    if(err){
        console.log("Error in running express server",err);
        return;
    }
    try { var files = fs.readdirSync(path.join(__dirname,'/uploads')); }
    catch(e) { return; }
    if (files.length > 0)
      for (let i = 0; i < files.length; i++) {
        var filePath = path.join(__dirname,'/uploads',files[i]);
        if (fs.statSync(filePath).isFile())
          fs.unlinkSync(filePath);
      }
    console.log("Server is up and running on port",port);
});