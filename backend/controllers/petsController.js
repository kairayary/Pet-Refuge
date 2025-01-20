const {readDatabase, writeDatabase} = require('../services/databaseService');

//Función que devuelve todas las mascotas en el archivo json
const getPets = (req, res)=>{

    //Para obtener la base de datos
    const db = readDatabase();

    //Devuelve la lista de mascotas
    res.json(db.pets);
};

//Función que añade una nueva mascota al archivo json
const addPet = (req,res)=>{

    //Pra obtener los datos de la mascota del cuerpo de la solicitud HTTP
    const {name, type, description, image} = req.body;
    
    //Se obtiene la base de datos
    const db = readDatabase();

    //Creación de una nueva mascota
    const newPet = {id: Date.now(), name, type, description, image};
    
    //Se agrega la mascota a la base de datos
    db.pets.push(newPet);

    //Para escribir en la base de datos
    writeDatabase(db);

    res.status(201).json(newPet);
};

//Función que actualiza los detalles de una mascota por su ID
const update = (req, res)=>{

    //Obtener el ID de la mascota de los parámetros de la ruta HTTP
    const {id} = req.params;

    //Obtener los datos de la mascota del cuerpo de la solicitud
    const {name, type, description, image} = req.body;
    const db = readDatabase();

    //Encontrar la mascota en la base de datos
    const pet = db.pets.find(pet => pet.id === parseInt(id));
    
    //Verificar si la mascota existe
    if (!pet) {
        return res.status(404).json({error: 'La Mascota no fue encontrada'});
    };

    //Actualizar la mascota y se escribe la base de datos actualizada
    pet.name = name;
    pet.type = type;
    pet.description = description;
    pet.image = image;
    writeDatabase(db);
    res.json(pet);
};

//Función que elimina una mascota del archivo json por su ID
const deletePet = (req, res)=> {
    //Para obtener el ID de la mascota de los parámetros de la ruta HTTP
    const {id}= req.params;
   
    //Leer la base de datos
    const db = readDatabase();
    
    //Para encontrar el índice de la mascota en la base de datos
    const petIndex = db.pets.findIndex(pet=> pet.id === parseInt(id));
    
    //Se verifica si la mascota existe
    if (petIndex === -1) {
        return res.status(404).json({error:'Ooop!!!...Mascota no encontrada'});
    };

    //Para eliminar la mascota de la base de datos
    db.pets.splice(petIndex, 1);
    writeDatabase(db);
    res.json({message:'La Mascota ha sido eliminada exitosamente'});
};

module.exports = {getPets, addPet, update, deletePet};