const express = require('express');
const { getRestaurants, getRestaurantDetails } = require('../controllers/RestaurantController');

const router = express.Router();

router.get('/', getRestaurants);
router.get('/:restaurantId', getRestaurantDetails);

module.exports = router;
