const express = require('express');
const { 
  getPendingRestaurants, verifyRestaurant, uploadMedia, 
  getAllUsers, syncUser, updateUserRole, deleteUser 
} = require('../controllers/AdminController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get('/pending-restaurants', getPendingRestaurants);
router.post('/verify-restaurant', verifyRestaurant);
router.post('/upload', upload.single('file'), uploadMedia);
router.get('/users', getAllUsers);
router.post('/users/sync', syncUser);
router.post('/users/update-role', updateUserRole);
router.delete('/users/:userId', deleteUser);

module.exports = router;
