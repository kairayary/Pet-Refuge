const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/database.json');

function readDatabase() {
    try {
        if (!fs.existsSync(dbPath)) {
            // Si el archivo no existe, lo crea con una estructura vacía
            fs.writeFileSync(dbPath, JSON.stringify({ pets: [], users: [], adoptions: [] }, null, 2), 'utf8');
        }
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer la base de datos: ", error);
        return { pets: [], users: [], adoptions: [] };
    }
}

function writeDatabase(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Error al guardar la base de datos: ", error);
    }
}

module.exports = { readDatabase, writeDatabase };
