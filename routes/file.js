const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file_controller')

router.post('/upload', fileController.upload);
router.get('/open', fileController.open);
router.get('/upload/asc', fileController.open);

module.exports = router;