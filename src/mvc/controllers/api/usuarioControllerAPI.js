var Usuario = require('../../models/usuario');

exports.usuario_create = async function (req, res) {

    try {
        const body = req.body;
    
        var email = body.email.trim();
        var nombre = body.nombre.trim();
        var password = body.password.trim();

        try {
            var usuario = new Usuario( { nombre, email, password } );
        } catch (e) {
            res.status(400).json({
                message: "Bad Request",
                description: error.description
            });
            return;
        }
        console.log(usuario)
        await usuario.save();
        usuario.enviar_email_bienvenida();
        
    } catch( error ) {
        res.status(500).json({
            message: "Internal Error"
        });
        return;
    }

    res.status(200).json({
        message: "OK"
    })

};

exports.usuarios_list = async function(req, res) {
    var usuarios = await Usuario.find({});

    res.status(200).json({
        usuarios
    })
};

exports.usuario_reservar = async function( req, res ) {

    try {
        const body = req.body;

        var id = body.id;
        var biciId = body.bici_id;
        var desde = body.desde;
        var hasta = body.hasta;
    
        var usuario = await Usuario.findById( id );

    
        var reserva = await usuario.reservar( biciId, desde, hasta );

        reserva = await reserva.populate('usuario').populate('bicicleta').execPopulate();

        console.log(reserva);

        res.status(200).json({reserva});
        return;

    } catch (error) {
        console.log(error);
        res.status(500).json({
            code:500,
            message: "Internal Error"
        });
        return;
    }

 
};

