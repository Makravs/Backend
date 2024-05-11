const asyncHandler = require('express-async-handler');
const Rental = require('../models/rentalModel'); // Importa el modelo de rentas

// Obtener todas las rentas del usuario autenticado
const getRentals = asyncHandler(async (req, res) => {
    const { status } = req.query;  // Obtiene el parámetro de consulta 'status' si existe
    let query = { user: req.user._id }; // Búsqueda base por usuario

    // Agrega el filtro de la consulta
    if (status) {
        query.status = status;
    }

    const rentals = await Rental.find(query).populate('movie');
    res.status(200).json(rentals);
});

// Crear una renta
const createRental = asyncHandler(async (req, res) => {
    const { movie, returnDate } = req.body;

    if (!movie || !returnDate) {
        res.status(400);
        throw new Error('Por favor añade todos los campos necesarios: película y fecha de devolución');
    }

    // Verificar si la película ya está rentada
    const existingRental = await Rental.findOne({
        movie: movie,
        status: 'rented'
    });

    if (existingRental) {
        res.status(400).json({ message: "La película ya está rentada" });
        return;
    }

    const rental = await Rental.create({
        movie,
        user: req.user._id, // Automáticamente toma el ID del usuario desde la sesión
        rentalDate: Date.now(),
        returnDate,
        status: 'rented'
    });

    res.status(201).json(rental);
});

// Actualizar una renta
const updateRental = asyncHandler(async (req, res) => {
    const { returnDate, status } = req.body;
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
        res.status(404);
        throw new Error('Renta no encontrada');
    }

    // Solo el usuario que creó puede actualizar
    if (rental.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Usuario no autorizado');
    }

    rental.returnDate = returnDate || rental.returnDate;
    rental.status = status || rental.status;
    await rental.save();
    res.status(200).json(rental);
});

// Eliminar una renta
const deleteRental = asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
        res.status(404).json({ message: 'Renta no encontrada' });
        return;
    }

    await Rental.deleteOne({ _id: rental._id });
    res.status(200).json({ message: 'Renta eliminada', id: req.params.id });
});

module.exports = {
    getRentals,
    createRental,
    updateRental,
    deleteRental
};