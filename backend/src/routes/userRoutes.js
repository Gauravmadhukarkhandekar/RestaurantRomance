const express = require('express');
const { createUser, getProfile, getDiscoverUsers } = require('../controllers/UserController');

const router = express.Router();

router.post('/', createUser);
router.get('/discover', getDiscoverUsers);
router.get('/:userId', getProfile);

module.exports = router;
