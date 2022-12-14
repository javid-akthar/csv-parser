const express = require('express');
const router = express.Router();

// importing homecontroller
const homeController = require('../controllers/home_controller');

//route for homepage/ upload page
router.get('/', homeController.home);    

// route for all file related functionalities
router.use('/file', require('./file'));  

module.exports = router;