const jwt = require('jsonwebtoken');

//MiddLeware para autenticar el token JWT
function authenticateToken(req,res,next) {

    //Para obtener el token de los encabezados de la solicitud
    const token = req.header('Authorization')?.replace('Bearer ', '');

    //Verifica si no se proporciono el token
    if (!token) {
        return res.status(401).json({error:'Acceso denegado.'});   
    };

    //Para verificar el token con la clave secreta
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if (err) {
            return res.status(403).json({error:'Token inválido o expirado'});

        };
        //Agrega el usuario al object req para que este disponible en las rutas
        req.user = user;
        
        //Es para continuar con el proximo middleware o ruta
        next();
    });
    
};

module.exports = {authenticateToken};