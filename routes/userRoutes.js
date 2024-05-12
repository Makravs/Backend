const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
    login,
    register,
    showData,
    getAllUsers,
    updateUser,
    deleteUser
} = require('../controllers/userController');

router.post('/login', login);

router.post('/register', register);

router.get('/showdata', protect, showData);

router.get('/all', protect, getAllUsers);

router.put('/:id', protect, updateUser);

router.delete('/:id', protect, deleteUser);


module.exports = router;