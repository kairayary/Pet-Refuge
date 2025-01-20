const express = require('express');
const {getPets, addPet, updatePet, deletePet, adoptPet} = require('../controllers/petsController');

const router = express.Router();

//Lista mascotas
router.get("/", getPets);

//Agrega una nueva mascota
router.post("/", addPet);

//Actualiza mascota
router.put("/", updatePet);

//Elimina mascota
router.delete("/", deletePet);

//Asigna mascota a un usuario
router.post("/", adoptPet);

module.exports = router;