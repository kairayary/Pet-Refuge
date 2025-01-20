const express = require('express');
const {registerUser, loginUser}= require('../controllers/usersController');
const router = express.Router();

//Registra un nuevo usuario
router.post("/register", registerUser);

//Inicio de sesión de usuario existente
router.post("/login", loginUser);

module.exports = router;