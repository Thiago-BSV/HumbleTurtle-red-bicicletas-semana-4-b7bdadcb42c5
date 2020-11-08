const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

var ReservaSchema = new Schema({
    desde: Date,
    hasta: Date,

    bicicleta: { 
        type: Schema.Types.ObjectId, 
        ref: 'Bicicleta' 
    },

    usuario:   { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario' 
    }

});

ReservaSchema.methods.diasDeReserva = function() {
    return moment(this.hasta).diff(moment(this.desde), 'days') + 1;
}

module.exports = mongoose.model('Reserva', ReservaSchema );