var mongoose = require('mongoose');

var Usuario = require('../../src/mvc/models/usuario');
var Bicicleta = require('../../src/mvc/models/bicicleta');
var Reserva = require('../../src/mvc/models/reserva');


var mongoDB = 'mongodb://localhost:27017/testdb';

describe('Testing Usuarios', function() {
    
    beforeEach( async function(done) {
        // Conectar solo si no está conectado
        if ( mongoose.connection.readyState == 0 ){
            mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
        
            var db = mongoose.connection;
        
            db.on('error', console.error.bind(console, 'connection error'));
        
            async function connected() {

                // Borrar los tres documentos
                await Reserva.deleteMany( {} );
                await Usuario.deleteMany( {} );
                await Bicicleta.deleteMany( {} );

                console.log('We are connected to the test database !');    
                done();
            }

            db.once('open', connected );

        } else {
            done();
        }
    });
    
    afterEach( async function(done) { 
        try {
            // Borrar los tres documentos
            await Reserva.deleteMany( {} );
            await Usuario.deleteMany( {} );
            await Bicicleta.deleteMany( {} );
        } catch(err) {
            console.error(err);
        } finally {
            done();
        }

    });

    describe('Cuando un usuario reserva una bici', () => {
        it('', async (done) => {

            try {
                const usuario = new Usuario({nombre:'Ezequiel', email:'test@drive.com', password:'12345'});
                await usuario.save();
    
                const bicicleta = new Bicicleta( {code: 1, color:"roja", modelo:"urbana" });
                await bicicleta.save();
    
                var hoy = new Date();
                var manana =new Date();
    
                manana.setDate( hoy.getDate() + 1);
    
                var reserva = await usuario.reservar( bicicleta.id, hoy, manana );

                var reservas = await Reserva.find({}).populate('bicicleta').populate('usuario')

                expect(reservas.length).toBe(1);

                var reserva = reservas[0];

                expect( reserva.diasDeReserva()).toBe(2);
                expect( reserva.bicicleta.code ).toBe(1);
                expect( reserva.usuario.nombre ).toBe( usuario.nombre );

            } catch (error) {
                console.error(error);
            } finally{
                done();
            }

        })
    });

});