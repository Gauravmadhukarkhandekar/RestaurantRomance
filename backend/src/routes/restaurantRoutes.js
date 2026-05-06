const express = require('express');
const { 
  getRestaurants, getRestaurantDetails, createRestaurant, 
  updateRestaurant, deleteRestaurant 
} = require('../controllers/RestaurantController');

const router = express.Router();

router.get('/', getRestaurants);
router.post('/', createRestaurant);
router.get('/:restaurantId', getRestaurantDetails);
router.put('/:restaurantId', updateRestaurant);
router.delete('/:restaurantId', deleteRestaurant);

module.exports = router;
