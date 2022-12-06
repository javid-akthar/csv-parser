const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname,'../production_logs');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval:'1d',
    path:logDirectory
});

const development = {
    name :'development',
    morgan:{
        mode:'dev',
        options:{stream: accessLogStream}
    }
}

const production = {
    name :'production',
    morgan:{
        mode:'combined',
        options:{stream: accessLogStream}
    }
}

module.exports = eval(process.env.NODE_ENV)== undefined ? development:eval(process.env.NODE_ENV);