const mongoose = require('mongoose');
const Reserva = require('./reserva');
const bcrypt = require('bcrypt');
const cryptoRandomString = require('crypto-random-string');

const Token = require('./token');
const mailer = require('../../mailer/mailer');

const UniqueValidatorPlugin = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const saltRounds = 10;

const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

var UsuarioSchema = new Schema({

    email:{
        unique: true,
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        validate: [validateEmail, 'Pr favor, ingrese un email válido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },

    nombre: {
        unique: false,
        type: String, 
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },

    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },

    passwordResetToken: String,
    passwordResetTokenExpires: Date,

    verificado: {
        type: Boolean,
        default: false
    }
});

UsuarioSchema.pre('save', function(next) {

    // si el password cambio
    if( this.isModified('password') || this.isNew ) {
        console.log('Entra');
        this.password = bcrypt.hashSync( this.password, saltRounds );
    }

    next();
});

UsuarioSchema.plugin( UniqueValidatorPlugin, { 
    message:'El {PATH} ya existe con otro usuario.'
});

UsuarioSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync( password, this.password );
}

UsuarioSchema.statics.validEmail = validateEmail;

UsuarioSchema.methods.reservar = async function(biciId, desde, hasta, cb ) {
    var reserva = new Reserva( { usuario: this._id, bicicleta: biciId, desde, hasta} );

    if(cb)
        await reserva.save(cb);
    else
        await reserva.save();
    
    return reserva;
}

UsuarioSchema.methods.enviar_email_bienvenida = async function() {
    const token = new Token({_userId: this.id, tipo: Token.VERIFICACION_TOKEN, token: cryptoRandomString({length: 20, type: 'url-safe'}) });

    const email_destination = this.email;
    await token.save();
    
    console.log(token.token);
    var enlace = 'http://localhost:3000'+'/token/confirmacion/' + token.token;

    const mailOptions = {
        from: 'pruebasemail515912@protonmail.com',
        to: email_destination,
        subject: 'Verificación de cuenta',
        html: 'Hola, \n\n' + 'Por favor, para verificar tu cuenta haga click en este enlace \n' + '<a href=\''+enlace+'\'>'+enlace+'</a>\n'
    }

    mailer.sendMail( mailOptions, function(err) {
        if(err) { return console.log(err.message) }

        console.log('Se ha enviado un email de bienvenida a ' + email_destination + '\n')
    })
}

UsuarioSchema.methods.enviar_email_recuperar_contraseña = async function() {
    const token = new Token({_userId: this.id, tipo: Token.RECUPERACION_CONTRASENA_TOKEN, token: cryptoRandomString({length: 20, type: 'url-safe'}) });

    const email_destination = this.email;
    await token.save();
    
    console.log(token.token);
    var enlace = 'http://localhost:3000'+'/token/recuperar-contrasena/' + token.token;

    const mailOptions = {
        from: 'pruebasemail515912@protonmail.com',
        to: email_destination,
        subject: 'Recuperar Contraseña',
        html: 'Hola, \n\n' + 'Si desea cambiar su contraseña visite el siguiente \n' + '<a href=\''+enlace+'\'>'+enlace+'</a>\n'
    }

    mailer.sendMail( mailOptions, function(err) {
        if(err) { return console.log(err.message) }

        console.log('Se ha enviado un email de bienvenida a ' + email_destination + '\n')
    })
}

UsuarioSchema.statics.findOneOrCreateByFacebook = async function( profile, callback ) {

    const self = this;
    
    var user = await self.findOne( {
        $or:[
            {'facebookId' : profile.id }, { 'email': profile.emails[0].value }
        ]
    }, function(error, result) {

        if(result) {
            callback(error, result);
        } else {

            console.log("--------------CONDITION------------");
            console.log(profile);

            let values = {};

            values.facebookId = profile.id;
            values.email = profile.emails[0].value;

            values.nombre = profile.displayName || 'SIN NOMBRE';
            values.verificado = true;

            // Ponemos cualquier password ya que usará google
            values.password = cryptoRandomString({length: 30, type: 'url-safe'});

            console.log('--------------VALUES-------------------');
            console.log(values);

            self.create(values, function(err, result) {
                if(err) console.log(err);
                return callback(err, result);
            });
            
        }
    });
};

UsuarioSchema.statics.findOneOrCreateByGoogle = async function( profile, callback ) {

    const self = this;
    console.log(profile);

    var user = await self.findOne( {
        $or:[
            {'googleId' : profile.id }, { 'email': profile.emails[0].value }
        ]
    }, function(error, result) {
        if(result) {
            callback(error, result);
        } else {
            console.log("--------------CONDITION------------");
            console.log(profile);

            let values = {};

            values.googleId = profile.id;
            values.email = profile.emails[0].value;

            values.nombre = profile.displayName || 'SIN NOMBRE';
            values.verificado = true;

            // Ponemos cualquier password ya que usará google
            values.password = cryptoRandomString({length: 30, type: 'url-safe'});

            console.log('--------------VALUES-------------------');
            console.log(values);

            self.create(values, function(err, result) {
                if(err) console.log(err);
                return callback(err, result);
            });
        }
    });
};

module.exports = mongoose.model('Usuario', UsuarioSchema );