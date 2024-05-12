const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
    getRentals,
    createRental,
    updateRental,
    deleteRental
} = require('../controllers/rentalController');

router.route('/')
    .get(protect, getRentals)
    .post(protect, createRental);

router.route('/:id')
    .put(protect, updateRental)
    .delete(protect, deleteRental);
module.exports = router;