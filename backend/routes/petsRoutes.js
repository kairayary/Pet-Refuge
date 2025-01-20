const express = require('express');
const {getPets, addPet, updatePet, deletePet, adoptPet} = require('../controllers/petsController');
const { authenticateToken } = require('../middLeware/authMiddleware');
const router = express.Router();

//Lista mascotas
router.get("/", getPets);

//Agrega una nueva mascota
router.post("/", authenticateToken, addPet);

//Actualiza mascota
router.put("/:id",authenticateToken, updatePet);

//Elimina mascota
router.delete("/", authenticateToken, deletePet);

//Asigna mascota a un usuario
router.post("/adopt",authenticateToken, adoptPet);

module.exports = router;