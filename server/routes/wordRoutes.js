const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');

router
    .get('/', wordController.generateRandomWords);

module.exports = router;
