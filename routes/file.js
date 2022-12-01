const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file_controller')

router.post('/upload', fileController.upload);
router.get('/open', fileController.open);
router.post('/open/sort', fileController.sortArray);
router.post('/open/search', fileController.searchArray);
router.get('/delete/',fileController.delete)

module.exports = router;