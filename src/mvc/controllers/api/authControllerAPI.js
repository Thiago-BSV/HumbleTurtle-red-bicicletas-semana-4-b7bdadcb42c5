const Usuario = require('../../models/usuario');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

module.exports = {
    authenticate: async function(req, res, next) {
        try { 

            var email = req.body.email;
            var password = req.body.password;

            var usuario = await Usuario.findOne({ email })
            
            if( usuario == null ) {
                return res.status(401).json({status:"error", message:"Email no encontrado!"});
            }

            if( usuario != null && bcrypt.compareSync(password, usuario.password) ) {

                const token = jwt.sign( {id: usuario._id }, req.app.get('secretKey'), {expiresIn:'7d'});
                res.status(200).json({message: "usuario encontrado!", data:{usuario, token} });
            } else {
                res.status(401).json({status:"error", message: "Invalido email/password", data: null});
            }
        
        } catch(error) {
            console.log(error);
        }
    },

    forgotPassword: async function( req, res, next ) {
        var email = req.body.email;

        var usuario = await Usuario.findOne({email});
        if(!usuario) {
            return res.status(401).json({ message:"No existe el usuario.", data: null } );
        } else {
            usuario.enviar_email_recuperar_contraseña();
            res.status(200).json({message:"Se envia un email para reestablecer el password:", data: null});
        }
    },

    authFacebookToken: function(req, res, next) {
        if(req.user) {
            const token = jwt.sign({id: req.user._id}, req.app.get('secretKey'), {expiresIn: '7d'} )
            res.status(200).json( {message:"Usuario encontrado o creado!", data: {user:req.user, token: token}} )
        } else {
            res.status(401).send("Unauthorized");
        }
    }

}