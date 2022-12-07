const express = require('express');
const port = process.env.PORT || 3003;
const fs = require('fs');
const path = require('path');
const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const ejs = require('ejs');
const logger = require('morgan');
const env = require('./config/environment');
console.log('env', env);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayout);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('assets'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(logger(env.morgan.mode, env.morgan.options));
app.use('/', require('./routes/index'));

app.listen(port, function (err) {
  if (err) {
    console.log("Error in running express server", err);
    return;
  }
  try {
    var files = fs.readdirSync(path.join(__dirname, '/uploads'));
    if (files.length > 0)
      for (file of files) {
        var filePath = path.join(__dirname, '/uploads', file);
        if (fs.statSync(filePath).isFile())
          fs.unlinkSync(filePath);
      }
    console.log(`Server is up and running on port ${port}`);
  } catch (err) {
    console.log(err);
    console.log("Error in running express server", err);
  }
});