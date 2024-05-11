const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
    getRentals,
    createRental,
    updateRental,
    deleteRental
} = require('../controllers/rentalController');

// Rutas para manejar la obtención y creación de rentas
router.route('/')
    .get(protect, getRentals)  // Obtener todas las rentas del usuario autenticado
    .post(protect, createRental);  // Crear una nueva renta

// Rutas para manejar la actualización y eliminación de rentas específicas
router.route('/:id')
    .put(protect, updateRental)  // Actualizar una renta específica
    .delete(protect, deleteRental);  // Eliminar una renta específica

module.exports = router;