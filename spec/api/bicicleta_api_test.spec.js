const { Mongoose } = require('mongoose');

var Bicicleta = require('../../src/mvc/models/bicicleta');

var request = require('request');
var server = require('../../bin/www');

var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/testdb';

mongoose.set('useCreateIndex', true);

var base_url = "http://localhost:3000/api/bicicletas";

describe('Bicicleta API', () => {
    
    beforeEach( async function(done) {
        
        // Si ya estamos conectados a una base de datos que no sea la de test, desconectamos
        if ( mongoose.connection.db != undefined && mongoose.connection.db.databaseName != 'testdb' ) {
            await mongoose.connection.close();
        }

        if ( mongoose.connection.readyState == 0 ){
            mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
        
            var db = mongoose.connection;
        
            db.on('error', console.error.bind(console, 'connection error'));
        
            function connected() {
                
                Bicicleta.deleteMany({}, function(err, success) {
                    if(err) console.log(err);
                    done();
                });

                console.log('We are connected to the test database !');    
                done();
            }

            db.once('open', connected );

        } else {
            done();
        }
    });
    
    afterEach( function(done) { 
        Bicicleta.deleteMany({}, function(err, success) {
            if(err) console.log(err);
            done();
        });
    });

    describe('GET BICICLETAS /', () => {
        it('Status 200', async (done) => {
            var allBicis = await Bicicleta.allBicis();

            expect(allBicis.length).toBe(0);

            var bici = Bicicleta.createInstance(1,"verde", "urbana", [30,40]);
            await Bicicleta.add(bici);

            request.get( base_url, function( error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            })
        })
    })

    describe('GET BICICLETAS /create', () => {
        it('Status 200', async (done) => {

            var headers = {'content-type': 'application/json'};
            var aBici = '{"code": 10, "color":"rojo", "modelo":"urbana", "lat": 10, "lng": 5 }';
            var url = base_url + '/create';
            
            request.post( {
                headers,
                url,
                body: aBici
                }, async ( error, response, body) => {
                    expect( response.statusCode ).toBe(200);
                    expect( ( await Bicicleta.findByCode(10) ).color).toBe('rojo');
                    done(); // Necesario ya que es asincrónico
                }
            );
        })
    })

    describe('POST BICICLETAS /update', () => {

        it('Status 200', async (done) => {

            var aBiciObj = {"code":1, "color":"azul", "modelo":"urbana", "lat": 10, "lng": 5 };

            var bici = new Bicicleta(aBiciObj);
            await bici.save(); // guardamos la bicicleta

            // Luego de guardar, cambiamos el color de nuestro objeto bici 
            // y lo enviamos por el endpoint /update de bicicletas
            aBiciObj.color = "rojo";

            var headers = {'content-type': 'application/json'};
            var url =   base_url +'/' + aBiciObj.code + '/update';

            request.post( {
                headers,
                url,
                body: JSON.stringify( aBiciObj )
                }, async function( error, response, body) {
                    expect(response.statusCode).toBe(200);

                    var target = await Bicicleta.findByCode(aBiciObj.code);
                    expect(target).not.toEqual(null);

                    expect(  target.color ).toBe( aBiciObj.color );
                    done(); // Necesario ya que es asincrónico
            });

            request 
        })
    })

    describe('POST BICICLETAS /delete', () => {

        it('Status 200', async (done) => {
            
            var bici = await Bicicleta.createInstance(1,"verde", "urbana", [30,40]);
            await bici.save();

            var headers = {'content-type': 'application/json'};
            var url =  base_url + '/'+1+'/delete';
            
            request.post( {
                headers,
                url,
                body: ""
                }, async function( error, response, body) {
                    expect(response.statusCode).toBe(200);

                    // Sabemos que si buscamos un id que no existe, nos da error
                    // Si no existe el id 1, significa que se borró correctamente, por lo tanto
                    // debe pasar el test
                    var error = false;
                    try{
                        var bici = await Bicicleta.findByCode(1);

                        if(bici == null)
                            throw new Error("Bicicleta no encontrada");

                    } catch(err) {
                        error=true;
                    }
                    // Esperamos que exista un error de búsqueda
                    expect(error).toEqual(true);
                    
                    done(); // Necesario ya que es asincrónico
            });

            request 
        })
    })

});