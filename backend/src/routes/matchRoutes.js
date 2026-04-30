const express = require('express');
const { recordSwipe } = require('../controllers/MatchController');

const router = express.Router();

router.post('/swipe', recordSwipe);

module.exports = router;
