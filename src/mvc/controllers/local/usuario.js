var Usuario = require("../../models/usuario.js");

function getErrors(){
    return {
        complete_obligatorio: {
            confirm: false,
            message: "Complete todos los campos con *"
        },

        nombre: {
            confirm: false,
            message: "Inserte un nombre"
        },

        email: {
            confirm: false,
            message: "Email inválido"
        },

        password: {
            confirm: false,
            message: "Inserte un password por favor"
        }
    }
}

function validarDatos( nombre, email, password, confirm_password ) {
    var error = false;
    var errors = getErrors();
        
    if ( email == "" || nombre == "" || password == "" || confirm_password == "" ) {
        error = true;
        errors.complete_obligatorio.confirm = true;
    }

    if ( password != confirm_password ) {
        error = true;
        errors.password.confirm = true;
    }

    if ( !Usuario.validEmail(email) ) {
        error =true;
        errors.email.confirm  = true;
        errors.email.message = "Ingrese un email válido";
    }

    return {
        error,
        errors
    }
}

exports.usuario_list = async function(req, res) {
    res.render('usuarios/index', { usuarios: await Usuario.find({}) } );
}

exports.usuario_create = function(req, res) {
    res.render('usuarios/create', { errors:getErrors() } );
}

exports.usuario_create_post = async function(req, res) {

    var body = req.body;

    var email = body.email.trim();
    var nombre = body.nombre.trim();
    var password = body.password.trim();
    var confirm_password = body.confirm_password.trim();

    var validacion = validarDatos(nombre, email, password, confirm_password);

    // Si hay algún error
    if ( validacion.error ) {
        res.render('usuarios/create', {errors:validacion.errors} );
        return;
    }

    var usuario = new Usuario({ email, nombre, password });

    try {

        await usuario.save();

    } catch (error) {
        console.log(error);

        if( error.errors && error.errors.email ) {

            error = error.errors;

            if( error.email.kind == 'unique' ) {
    
                validacion.errors.email.confirm = true;
                validacion.errors.email.message = "El email ya está en uso.";
                
                var data = { email, nombre, password, confirm_password };
    
                res.render('usuarios/create', { data, errors: validacion.errors } );
            } else {
                console.log("\nUnexpected error models/usuario.js");
            }

        }


        return;
    }

    usuario.enviar_email_bienvenida();

    res.redirect('/usuarios');
}

exports.usuario_update = async function(req, res) {
    var usuario = await Usuario.findById(req.params.id);
    
    console.log(usuario);
    res.render('usuarios/update', { usuario, errors: getErrors() } );
}

exports.usuario_update_post = async function(req, res) {
    var usuario = await Usuario.findById(req.params.id);

    var body = req.body;

    var email = body.email.trim();
    var nombre = body.nombre.trim();
    var password = body.password.trim();
    var confirm_password = body.confirm_password.trim();

    var validacion = validarDatos(nombre, email, password, confirm_password);

    // Si hay algún error
    if ( validacion.error ) {
        var data = { email, nombre, password, confirm_password };
        res.render('usuarios/update', {data, errors:validacion.errors} );
        return;
    }
    
    //No permitiremos el cambio de id
    usuario.email =email;
    usuario.password = password;
    usuario.nombre = nombre;

    await usuario.save();

    res.redirect(`/usuarios`)
}

exports.usuario_delete_post = async function(req, res) {

    await Usuario.findOneAndDelete( { _id: req.params.id } );
    res.redirect('/usuarios');

}

exports.usuario_login = async function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    var usuario = await Usuario.findOne( {email} )
    
    //Si se encuentra al usuario
    if( usuario && usuario.validPassword(password) ) {
        // Aceptado
        console.log('login aceptado !');

        res.status(200).json({message:'Ok'});
    } else{
        res.status(401).json({message:'Unauthorized.'});
    }
}

exports.usuario_logout = async function( req, res) {
    console.log('Ha cerrado sesión.');
    res.redirect('/');
}
