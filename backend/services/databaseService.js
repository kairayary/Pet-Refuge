const fs = require('fs');
const path = require ('path');

const dbPath = path.join(__dirname, '../data/database.json');

//Para leer los datos del archivo JSON y retorna los datos como un objeto Javascript

function readDatabase() {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data)    
};


//Guardar los datos del archivo JSON

function writeDatabase(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8')
};

module.exports = {readDatabase, writeDatabase};