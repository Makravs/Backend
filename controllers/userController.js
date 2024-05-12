const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel'); // Asegúrate de que la ruta al modelo es correcta
const Rental = require('../models/rentalModel');

// Registrarse
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Por favor añade todos los campos');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('El usuario ya existe');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
    });
});

// Iniciar sesión
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id, user.esAdmin)
        });
    } else {
        res.status(401);
        throw new Error('Credenciales incorrectas');
    }
});


// Actualizar Usuario
const updateUser = asyncHandler(async (req, res) => {
    if (!req.user.esAdmin) {
        res.status(401);
        throw new Error('No autorizado como administrador');
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    const { name, email, password } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email
    });
});

// Generar JWT
const generateToken = (id, esAdmin) => {
    return jwt.sign({ id, esAdmin }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Eliminar Usuario
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    await User.deleteOne({ _id: user._id });
    res.status(200).json({ id: req.params.id });
});

// Mostrar datos del usuario y sus rentas asociadas
const showData = asyncHandler(async (req, res) => {
    const userRentals = await Rental.find({ user: req.user._id }).select('_id');
    res.status(200).json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        esAdmin: req.user.esAdmin,
        rentals: userRentals.map(rental => rental._id)  // Devuelve solo los IDs de las rentas
    });
});



const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});



module.exports = {
    register,
    login,
    updateUser,
    deleteUser,
    getAllUsers,
    showData
};