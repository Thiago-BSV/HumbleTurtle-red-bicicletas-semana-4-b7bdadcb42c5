const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TokenSchema = new Schema({

    _userId: { 
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'Usuario' 
    },

    token: { 
        type: String, 
        required: true 
    },

    tipo: {
        type: Number,
        required: true
    },

    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now,
        expires: 43200 
    },

    googleId: String,
    facebookId: String
});


// Inicializamos los tipos de token
TokenSchema.statics.VERIFICACION_TOKEN = 0;
TokenSchema.statics.RECUPERACION_CONTRASENA_TOKEN = 1;


module.exports = mongoose.model('Token', TokenSchema );
