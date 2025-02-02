const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {readDatabase, writeDatabase} = require('../services/databaseService');

//Función para registrar un nuevo usuario en la base de datos
const registerUser = (req, res)=>{
   
    //Obtener los datos del cuerpo de la solicitud
    const {username,email, password} = req.body;
    console.log("Datos recibidos:", req.body);
    //Para leer la base de datos usando la función readDatabase
    const db = readDatabase();

    
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

      // Asegurar que users siempre sea un array
      const users = db.users || [];
    //Busca el usuario y luego se verifica si existe en la base de datos
    const existingUser =db.users.find(user=> user.username === username);
    
    if (existingUser) {
        return res.status(400).json({error:'El usuario ya existe'});
    };

    //Para encriptar la contraseña usando bcrypt.hashSync
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = { id: Date.now(), username, email, password:hashedPassword };
    //Agregar el usuario a la bd, primero se crea el objeto con los datos y luego se pushea
    db.users.push(newUser);
    
    //Se escribe la base de datos actualizada
    writeDatabase(db);
    db.users = users;
    
    // return newUser;
    //Respuesta de éxito
    res.status(201).json({message: 'El usuario ha sido registrado exitosamente'});
};


//Función para autenticar a un usuario existente en la base de datos
const loginUser = (req, res)=>{

    //Obtener los datos del cuerpo de la solicitud HTTP
    const {username, password} = req.body;
    
    //Leer la base de datos
    const db = readDatabase();
    
    //Buscar el usuario en la base de datos
    const user = db.users.find(user => user.username === username);

    //Validación de usuario y contraseña
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({error: 'Contraseña inválida'})
    };

    //Generación de token de autenticación
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.json({message:'Inicio de sesión exitoso', token});
};

module.exports ={registerUser, loginUser};