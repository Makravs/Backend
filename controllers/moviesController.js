const asyncHandler = require('express-async-handler')
const Movie = require('../models/movieModel')

// Obtener todas las películas
const getMovies = asyncHandler(async (req, res) => {
    const movies = await Movie.find({})
    res.status(200).json(movies)
})

// Crear una película
const createMovie = asyncHandler(async (req, res) => {
    const { title, description, year, poster } = req.body; // Corregido para incluir poster en lugar de rating
    if (!title || !description || !year || !poster) { // Asegúrate de que todos los campos necesarios estén presentes
        res.status(400);
        throw new Error('Todos los campos son necesarios');
    }

    const movie = await Movie.create({
        title,
        description,
        year,
        poster,
        createdBy: req.user._id
    });

    res.status(201).json(movie);
})

// Actualizar una película
const updateMovie = asyncHandler(async (req, res) => {
    const { title, description, year, poster } = req.body;
    const movie = await Movie.findById(req.params.id)

    if (!movie) {
        res.status(404);
        throw new Error('Película no encontrada');
    }

    // Actualizar los campos especificados, sin modificar el 'createdBy'
    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.year = year || movie.year;
    movie.poster = poster || movie.poster;

    const updatedMovie = await movie.save();
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