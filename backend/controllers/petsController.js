const { readDatabase, writeDatabase } = require('../services/databaseService');

//Función para obtener una lista de mascotas filtradas y devuelve todas la lista en formato json
const getPets = (req, res) => {

    //Para obtener la base de datos
    const db = readDatabase();

    //Para obtener los parámetros de de la solicitud HTTP
    const { type, status } = req.query;

    //Inicialización de la lista de mascotas filtradas
    let filteredPets = db.pets;

    //Filtro por tipo de animal
    if (type && type.trim() !== '') {
        filteredPets = filteredPets.filter(pet => pet.type && pet.type.toLowerCase() === type.toLowerCase());
    } else {
        filteredPets = filteredPets.filter(pet => pet.type !== undefined); // Si no se pasa un filtro, se pueden devolver solo los que tienen tipo definido
    }

    //Filtro por estado
    if (status && status.trim() !== '') {
        filteredPets = filteredPets.filter(pet => pet.status && pet.status.toLowerCase() === status.toLowerCase());
    } else {
        filteredPets = filteredPets.filter(pet => pet.status !== undefined); // Si no se pasa un filtro, solo se devuelven los que tienen estado definido
    }


    //Devuelve la lista de mascotas filtradas
    res.json({ pets: filteredPets });
};

//Función que añade una nueva mascota al archivo json
const addPet = (req, res) => {

    //Para obtener los datos de la mascota del cuerpo de la solicitud HTTP
    const { name, type, description, image, age, size, status } = req.body;

    //Se obtiene la base de datos
    const db = readDatabase();

    //Creación de una nueva mascota con los datos obtenidos del cuerpo de la solicitud
    const newPet = { id: Date.now(), name, type, description, image, age, size, status: "available" };

    //Se agrega la mascota a la base de datos
    db.pets.push(newPet);

    //Para escribir en la base de datos
    writeDatabase(db);

    res.status(201).json(newPet);
};

//Función que actualiza los detalles de una mascota por su ID
const updatePet = (req, res) => {

    //Obtener el ID de la mascota de los parámetros de la ruta HTTP
    const { id } = req.params;

    //Obtener los datos de la mascota del cuerpo de la solicitud
    const { name, type, description, image, age, size, status } = req.body;
    const db = readDatabase();

    //Encontrar la mascota en la base de datos
    const pet = db.pets.find(pet => pet.id === parseInt(id));

    //Verificar si la mascota existe
    if (!pet) {
        return res.status(404).json({ error: 'La Mascota no fue encontrada' });
    };

    //Actualizar la mascota y se escribe la base de datos actualizada
    pet.name = name;
    pet.type = type;
    pet.description = description;
    pet.image = image;
    pet.age = age;
    pet.size = size;
    pet.status = status;

    writeDatabase(db);
    res.json(pet);
};

//Función que elimina una mascota del archivo json por su ID
const deletePet = (req, res) => {
    //Para obtener el ID de la mascota de los parámetros de la ruta HTTP
    const { id } = req.params;

    //Leer la base de datos
    const db = readDatabase();

    //Para encontrar el índice de la mascota en la base de datos
    const petIndex = db.pets.findIndex(pet => pet.id === parseInt(id));

    //Se verifica si la mascota existe
    if (petIndex === -1) {
        return res.status(404).json({ error: 'Ooop!!!...Mascota no encontrada' });
    };

    //Para eliminar la mascota de la base de datos
    db.pets.splice(petIndex, 1);
    writeDatabase(db);
    res.json({ message: 'La Mascota ha sido eliminada exitosamente' });
};

//Función para asignar mascota a un usuario
const adoptPet = (req, res) => {
    //Para obtener datos de la adopción del cuerpo de la solicitud HTTP
    const { petId, userId } = req.body;
    const db = readDatabase();

    //Búsqueda de mascota y usuario en la base de datos que coinciden con el ID proporcionados
    const pet = db.pets.find(pet => pet.id === parseInt(petId));
    const user = db.users.find(user => user.id === parseInt(userId));

    //Verificación de si la mascota y el usuario existen en la base de datos
    if (!pet) {
        return res.status(404).json({ error: "La mascota solicitado NO fue encontrada" });
    };

    if (!user) {
        return res.status(404).json({ error: "El usuarios solicitado NO fue encontrado" });
    };

    //Verificación de la disponibilidad de la mascota
    if (pet.status !== "available") {
        return res.status(400).json({ error: "Mascota NO DISPONIBLE para adopción" });
    };

    //Actualiza el estado de la mascota
    pet.status = "adopted";

    //Agrega una nueva adopción a la base de datos
    db.adoptions.push({ id: Date.now(), userId, petId, date: new Date() });
    writeDatabase(db);

    res.json({ message: "La mascota ha sido adoptada con éxito", pet });
}

module.exports = { getPets, addPet, updatePet, deletePet, adoptPet };