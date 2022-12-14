const express = require('express');
const router = express.Router();

// importing file controller
const fileController = require('../controllers/file_controller')

// routes for file functionalities

// route for uploading file
router.post('/upload', fileController.upload);

// route for opening a file
router.get('/open', fileController.open);

// route for sort data in ascending or descending order based upon column selection
router.post('/open/sort', fileController.sortArray);

// route for search with keyword in table 
router.post('/open/search', fileController.searchArray);

// route for delete a file
router.get('/delete/', fileController.delete)

module.exports = router;