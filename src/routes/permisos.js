const jwt = require('jsonwebtoken');


function loggedIn(req, res, next) {
    if(req.user) {
        next();
    } else {
        console.log('User sin logearse');
        res.redirect('/auth/login');
    }
}

async function validarUsuario(req, res, next) {
    try{

        var token = req.headers['x-access-token'];

        if(!token)
            token = ""

        var decoded = await jwt.verify(token, req.app.get('secretKey') );
        
        req.body.userId = decoded.id;
        
        console.log('jwt verify: '+ decoded);

        next();
    
    } catch(err) {
        console.log(err);
        res.json({status:'error', message: err.messsage, data: null});        
    }
}

module.exports = {
    loggedIn,
    validarUsuario
}