const express = require('express');
const { getPendingRestaurants, verifyRestaurant } = require('../controllers/AdminController');

const router = express.Router();

router.get('/pending-restaurants', getPendingRestaurants);
router.post('/verify-restaurant', verifyRestaurant);

module.exports = router;
