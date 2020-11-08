

const passport = require('../../../config/passport');
const Usuario = require('../../models/usuario');
const Token = require('../../models/token');

exports.login_post = function(req, res, next) {
    // passport

    passport.authenticate('local', function(err, usuario, info ) {
        if(err) return next(err);
        
        if(!usuario) {
            console.log(info);
            return res.render('login/index', {info} );
        }


        req.login(usuario, function(err) {
            if(err) return next(err);
            return res.redirect('/');
        });
    })(req, res, next);
    

};

exports.login_get = function(req, res, next) {
    res.render('login/index');
};


exports.logout_get = function(req, res) {
    req.logout();
    res.redirect('/');
};


exports.registrarse = function(req, res) {
    return res.render('usuarios/create')
}

exports.solicitarCambioPass_get = function(req, res) {
    return res.render('login/solicitarCambio');
};

exports.solicitarCambioPass_post = async function(req, res) {
    try{
        var email = req.body.email;
        var usuario = await Usuario.findOne({email});
    
        if (!usuario) {
            res.redirect('/auth//solicitar-cambio-pass', { info:{message:"Email no encontrado!"} });
            return;
        }
        
        await usuario.enviar_email_recuperar_contraseña();
        
        res.status(200).send('Operación exitosa');
        return;
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal error.');
    }
};

exports.changePassword_get = async function(req, res) {


};

exports.cambiarContrasena_post= async function(req, res) {
    
    try{
        var tokenVal = req.body.token;

        var password = req.body.password;
        var confirmar_password = req.body.confirmar_password;

        if( password != confirmar_password ) {
            res.render('login/cambiarContrasena', {token:tokenVal, info:{ message:'Las contraseñas no coinciden!.' }});
            return;
        } 

        // Si el token existe
        var token = await Token.findOne( {token: tokenVal} );    

        // Si el token no existe o si es un tipo de token diferente al de cambiar contraseñas
        if(!token || (token.tipo && token.tipo !== Token.RECUPERACION_CONTRASENA_TOKEN ) ) {
            res.status(401).json({message:'Unauthorized'});
            return;
        }

        var usuario = await Usuario.findById(token._userId);
        if (!usuario) {
            res.status(401).json({message:'Unauthorized'});
        }
        
        // Cambiamos la contraseña y la persisitmos
        usuario.password = password;
        await usuario.save();

        // Destruimos el token una vez cambiada la contraseña
        await token.remove();

        // Avisamos al compañero
        res.render('login/cambiarContrasena', {token:tokenVal, info:{ cambiada: true, message:'Contraseña cambiada con éxito.' } });
        return;
        
    } catch (error){
        console.log(error);
        res.status(500).send("Internal error");
    }
};


