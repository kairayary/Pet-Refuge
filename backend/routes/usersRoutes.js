const express = require('express');
const {registerUser, loginUser}= require('../controllers/usersController');
const {authenticateToken} = require('../middLeware/authMiddleware');
const router = express.Router();

//Registra un nuevo usuario
router.post("/register", registerUser);

//Inicio de sesión de usuario existente
router.post("/login", loginUser);

//Ruta protegida que solo usuarios autenticados puedan acceder

router.get("/profile",authenticateToken, (req,res)=>{
    res.json({message:"Perfil de usuario", user:req.user});
})

module.exports = router;