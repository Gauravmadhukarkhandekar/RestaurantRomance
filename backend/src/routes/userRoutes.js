const express = require('express');
const { createUser, getProfile } = require('../controllers/UserController');

const router = express.Router();

router.post('/register', createUser);
router.get('/profile/:userId', getProfile);

module.exports = router;
