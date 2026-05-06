const express = require('express');
const { createBooking, getBooking, getAllBookings } = require('../controllers/BookingController');

const router = express.Router();

router.get('/', getAllBookings);
router.post('/', createBooking);
router.get('/:bookingId', getBooking);

module.exports = router;
