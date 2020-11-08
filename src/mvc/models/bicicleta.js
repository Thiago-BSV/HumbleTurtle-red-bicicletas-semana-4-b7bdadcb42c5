const { Schema } = require("mongoose");

const mongoose = require('mongoose');

var BicicletaSchema = new Schema( {
    code: Number,
    color: String,
    modelo: String,

    ubicacion: {
        type: [Number], index: { type: '2dsphere', sparse: true }
    }
});

BicicletaSchema.methods.toString = function () {
    return 'code: '+ this.code + " | color: "+ this.color;
}

BicicletaSchema.statics.createInstance = function( code, color, modelo, ubicacion ) {
    return new this({
        code,
        color,
        modelo,
        ubicacion
    })
}

BicicletaSchema.statics.allBicis = function (callback) {
    if ( callback )
        return this.find({}, callback);
    return this.find( {} );
}

BicicletaSchema.statics.add = function (aBici, callback) {
    
    if ( callback )
        return this.create(aBici, callback);

    return new Promise( async(resolve, reject) => {
        var bici = await this.create(aBici);
        await bici.save();

        resolve(bici);
    });

}

BicicletaSchema.statics.findByCode = function (aCode, callback) {
    if (callback)
        return this.findOne({code: aCode}, callback)

    return this.findOne({code: aCode})
}

BicicletaSchema.statics.removeByCode = function (aCode, callback) {
    if (callback)
        return this.deleteOne( {code: aCode}, callback);
    
    return this.deleteOne( {code: aCode} );
}

module.exports = mongoose.model('Bicicleta', BicicletaSchema);