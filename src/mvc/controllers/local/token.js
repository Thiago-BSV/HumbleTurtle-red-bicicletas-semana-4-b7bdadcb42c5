var Usuario = require('../../models/usuario');
var Token = require('../../models/token');

module.exports = {
    
    confirmacion_get: async function(req, res, next) {
        try{
            var token = await Token.findOne( { token: req.params.token } );
            
            // Si el token no existe o si el token no es del tipo verificacion
            if(!token || (token.tipo && token.tipo !== Token.VERIFICACION_TOKEN )) {
                return res.status(400).json({type: 'not-verified', message:'No encontrado.'});
            }

            var usuario = await Usuario.findById( token._userId );

            if(!usuario) {
                return res.status(400).json({message:'No encontramos al usuario.'});
            }
            usuario.verificado = true;

            await usuario.save();

            // Destruimos el token de un solo uso
            await token.remove();

            return res.redirect('/');

        } catch(err) {
            console.log(err);
            return res.status(500).json({message:'Internal error.'});
        }  
    },

    recuperarContrasena_get: async function(req, res, next) {
        
        try{
            var tokenVal = req.params.token;

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
            
            res.render('login/cambiarContrasena', { token: tokenVal } );
            
        } catch (error){
            console.log(error);
            res.status(500).send("Internal error");
        }
    }

}