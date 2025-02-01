const { readDatabase, writeDatabase, getPetsFromDatabase, savePetsToDatabase } = require('../services/databaseService');

//Función para obtener una lista de mascotas filtradas y devuelve todas la lista en formato json
const getPets = (req, res) => {

    //Para obtener la base de datos
    const db = readDatabase();

    //Para obtener los parámetros de de la solicitud HTTP
    const { name, type, status } = req.query;

    //Inicialización de la lista de mascotas filtradas
    let filteredPets = db.pets;

    //Filtro por nombre
    if (name && name.trim() !== '') {
        filteredPets = filteredPets.filter(pet => pet.name && pet.name.toLowerCase().includes(name.toLowerCase()))
    };

    //Filtro por tipo de animal
    if (type && type.trim() !== '') {
        filteredPets = filteredPets.filter(pet => pet.type && pet.type.toLowerCase() === type.toLowerCase());
    };

    //Filtro por estado
    if (status && status.trim() !== '') {
        filteredPets = filteredPets.filter(pet => pet.status && pet.status.toLowerCase() === status.toLowerCase());
    };
    
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
    const newPet = { id: Date.now(), name, type, description, image, age, size, status: status || "Disponible" };

    //Se agrega la mascota a la base de datos
    db.pets.push(newPet);

    //Para escribir en la base de datos
    // writeDatabase(db);

    // Guardamos la base de datos con la nueva mascota
    savePetsToDatabase(db.pets, db.adoptions);

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
    pet.name = name ?? pet.name;
    pet.type = type ?? pet.type;
    pet.description = description ?? pet.description;
    pet.image = image ?? pet.image;
    pet.age = age ?? pet.age;
    pet.size = size ?? pet.size;
    pet.status = status ?? pet.status;

    // writeDatabase(db);
    // Guardamos la base de datos con la mascota actualizada
    savePetsToDatabase(db.pets, db.adoptions);
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


    // Verificamos si la mascota está en adopción (en el array de adoptions)
    const isAdopted = db.adoptions.some(adoption => parseInt(adoption.petId) === parseInt(id));

    if (isAdopted) {
        // Si la mascota está adoptada, cambiamos su estado
        db.pets[petIndex].status = "Adoptada";  // Cambiar estado en lugar de eliminar
        savePetsToDatabase(db.pets, db.adoptions);
        return res.json({ message: 'La mascota ha sido desactivada porque ya fue adoptada' });
    }


    //Para eliminar la mascota de la base de datos si no esta adoptada
    db.pets.splice(petIndex, 1);
    // writeDatabase(db);

    // Guardamos la base de datos con la mascota eliminada
    savePetsToDatabase(db.pets, db.adoptions);
    res.json({ message: 'La Mascota ha sido eliminada exitosamente' });
};

//Función para asignar mascota a un usuario
const adoptPet = (req, res) => {
    //Para obtener datos de la adopción del cuerpo de la solicitud HTTP
    const { userId, petId } = req.body;
    console.log("Datos de adopción recibidos:", req.body);
    
    const db = readDatabase();
    console.log("Base de datos cargada:", db);

    // Verifica que `db.users` existe
    if (!db.users) {
        return res.status(500).json({ error: "Error interno: no se han cargado los usuarios." });
    }

    //Lógica para doptar la mascota
    
    const user = db.users.find(u => u.username === userId);

    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    };


    // Buscar la mascota disponible
    const pet = db.pets.find(pet => pet.id === parseInt(petId) && pet.status === 'Disponible');
    if (!pet) {
        return res.status(404).json({ error: 'Mascota no encontrada' });

    }
   
    console.log("Usuario encontrado:", user);
    console.log("Mascota encontrada:", pet);

    // Verificar la disponibilidad de la mascota
    if (!pet.status || pet.status.toLowerCase() === "adoptado") {
        return res.status(400).json({ error: "La mascota ya está adoptada." });
    }

    //Actualiza el estado de la mascota
    pet.status = "Adoptado";

    //Agrega una nueva adopción a la base de datos
    db.adoptions.push({
        id: Date.now(),
        userId:user.id,
        petId:pet.id,
        date: new Date().toISOString()
    });
     writeDatabase(db);

    res.json({ message: "La mascota ha sido adoptada con éxito", pet });
    console.log(req.body)
};



module.exports = { getPets, addPet, updatePet, deletePet, adoptPet };