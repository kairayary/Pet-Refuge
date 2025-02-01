const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/database.json');

function readDatabase() {
    try {
        
        const data = fs.readFileSync(dbPath, 'utf8');
        const db = JSON.parse(data);

        // Asegurar que existan todos los array
        if (!db.users) db.users = [];
        if (!db.pets) db.pets = [];
        if (!db.adoptions) db.adoptions = [];

        return db;
    } catch (error) {
        console.error("Error al leer la base de datos:", error);
        console.error("Ruta de la base de datos:", dbPath); // Para verificar si la ruta es correcta
        return { users: [], pets: [], adoptions: [] };
    }
};

function writeDatabase(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Error al guardar la base de datos: ", error);
    }
};

// Obtener las mascotas de la base de datos
function getPetsFromDatabase() {
    const data = readDatabase();  // Llama a readDatabase para obtener los datos
    return data.pets;  // Retorna el array de mascotas
};

function savePetsToDatabase(pets, adoptions) {
    
    try {
        // Primero se  carga los datos actuales
        const data = readDatabase();

        // Luego se actualiza los arrays de mascotas y adopciones
        data.pets = pets;
        data.adoptions = adoptions;

        //Se guarda los datos actualizados
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Error al guardar la base de datos: ", error);
    }
}
module.exports = { readDatabase, writeDatabase,getPetsFromDatabase, savePetsToDatabase };
