const express = require('express');
const dotenv = require('dotenv');
const petsRoutes = require('./routes/petsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const path = require('path');

// Cargamos las variables de entorno desde el archivo .env
dotenv.config();

// Creamos una aplicación Express
const app = express();

// Middleware para parsear el cuerpo de las solicitudes en JSON
app.use(express.json());

// Ruta para servir archivos estaticos de public
app.use(express.static(path.join(__dirname, '../public')));


// Rutas para mascotas y usuarios
app.use('/pets', petsRoutes);
app.use('/users', usersRoutes);

// Middleware de manejo de errores 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores global para cualquier otro tipo de error
app.use((err, req, res, next) => {
  console.error(err.stack); // Imprime el error en la consola
  res.status(500).json({ error: 'Algo salió mal' }); // Responde con un mensaje 
});

// Puerto desde las variables de entorno o por defecto 3000
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});