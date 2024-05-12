const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Por favor añade un título a la película"],
    },
    description: {
        type: String,
        required: [true, "Por favor añade una descripción a la película"],
    },
    year: {
        type: Number,
        required: [true, "Por favor añade el año de lanzamiento de la película"],
    },
    poster: {
        type: String,
        required: [true, "Por favor añade un enlace al póster de la película"],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Movie', movieSchema);