const asyncHandler = require('express-async-handler')
const Movie = require('../models/movieModel')

// Obtener todas las películas
const getMovies = asyncHandler(async (req, res) => {
    const movies = await Movie.find({})
    res.status(200).json(movies)
})

// Crear una película
const createMovie = asyncHandler(async (req, res) => {
    const { title, description, year, rating } = req.body;
    if (!title || !description || !year || !rating) {
        res.status(400);
        throw new Error('Todos los campos son necesarios');
    }

    // Asegúrate de incluir el ID del usuario autenticado como 'createdBy'
    const movie = await Movie.create({
        title,
        description,
        year,
        rating,
        createdBy: req.user._id  // Asume que 'req.user' tiene los detalles del usuario
    });

    res.status(201).json(movie);
})

// Actualizar una película
const updateMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id)

    if (!movie) {
        res.status(404);
        throw new Error('Película no encontrada');
    }

    // Solo actualizar campos especificados, sin modificar el 'createdBy'
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedMovie);
})

// Eliminar una película
const deleteMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id)

    if (!movie) {
        res.status(404);
        throw new Error('Película no encontrada');
    }

    await Movie.deleteOne({ _id: movie._id });
    res.status(200).json({ id: req.params.id });
})

module.exports = {
    getMovies,
    createMovie,
    updateMovie,
    deleteMovie
}