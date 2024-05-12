const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');  // Asegúrate de que la ruta del modelo esté correcta
const protect = asyncHandler(async (req, res, next) => {
    let token;
    // Asegúrate de que la propiedad se llama "authorization" y usa "startsWith" correctamente
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extraer el token del encabezado
            token = req.headers.authorization.split(' ')[1];
            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Obtener usuario del token
            req.user = await User.findById(decoded.id).select('-password');
            req.esAdmin = decoded.esAdmin;
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Acceso no autorizado');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Acceso no autorizado, token no proporcionado');
    }
});

module.exports = {
    protect

};