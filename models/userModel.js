const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Por favor poner el nombre"],  // Requerido, debe ser ingresado
    },
    email: {
        type: String,
        required: [true, "Por favor teclea tu email"],  // Requerido, debe ser único
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Por favor teclea tu password"],  // Requerido, para autenticación
    },
    esAdmin: {
        type: Boolean,
        default: false,  // Valor predeterminado es 'false', es decir, no todos los usuarios son admins
    }
}, {
    timestamps: true,  // Proporciona marcas de tiempo para la creación y actualización del registro
});

module.exports = mongoose.model('User', userSchema);