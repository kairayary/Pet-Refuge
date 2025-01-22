const express = require('express');
const {getPets, addPet, updatePet, deletePet, adoptPet} = require('../controllers/petsController');
const { authenticateToken } = require('../middLeware/authMiddleware');
const router = express.Router();

//Lista mascotas
router.get("/", getPets);

//Agrega una nueva mascota
router.post("/",  addPet);

//Actualiza mascota
router.put("/:id", updatePet);

//Elimina mascota
router.delete("/:id", deletePet);

//Asigna mascota a un usuario
router.post("/adopt", adoptPet);

module.exports = router;