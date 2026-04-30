const express = require('express');
const { createBooking, getBooking } = require('../controllers/BookingController');

const router = express.Router();

router.post('/', createBooking);
router.get('/:bookingId', getBooking);

module.exports = router;
