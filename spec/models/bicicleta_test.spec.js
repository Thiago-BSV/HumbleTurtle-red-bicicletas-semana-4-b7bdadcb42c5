const { Mongoose } = require('mongoose');
var Bicicleta = require('../../src/mvc/models/bicicleta');

var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/testdb';

mongoose.set('useCreateIndex', true);

async function testAsync( func ) {
    var error = false;
    try{
        await func();
    } catch(err) {
        console.log(err);
        error = true;
    } finally{
        return error;
    }
    
}

describe('Testing Bicicletas', function() {

    beforeEach( function(done) {
        if ( mongoose.connection.readyState == 0 ){
            mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
        
            var db = mongoose.connection;
        
            db.on('error', console.error.bind(console, 'connection error'));
        
            function connected() {
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

    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de bicicleta', () => {
            var bici = Bicicleta.createInstance(1,"verde", "urbana", [30,40]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion).toEqual( [30,40] );

        });
    }); 

    describe('Bicicleta.allBicis', function(){
        it('comienza vacía', (done) => {
            Bicicleta.allBicis( function(err, bicis) {
                console.log(bicis);
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    describe('Bicicleta.add', function() {
        it('inserta una instancia de bicicleta', function(done) {
            var bici = Bicicleta.createInstance(1,"verde", "urbana", [30,40]);
            
            Bicicleta.add( bici, (err, newBici) => {
                if(err) console.log(err);
                
                Bicicleta.allBicis( (err, bicis) => {
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toBe(1);
                    done();
                })

            });
        })
    });

    describe('Bicicleta.findByCode', function() {
        it('inserta una instancia de bicicleta', async function(done) {

            var bici1 = Bicicleta.createInstance(5,"verde", "urbana", [30,40]);
            var bici1 = Bicicleta.createInstance(50,"verde", "urbana", [30,40]);
            var bici2 = Bicicleta.createInstance(56,"verde", "urbana", [30,40]);

            await Bicicleta.add( bici1 );
            await Bicicleta.add( bici2 );

            var target = await Bicicleta.findByCode( 56 );
            
            expect(target).not.toEqual(null, "Esperamos que exista");

            if(target)
                expect(target.code).toBe(56);

            done();
        })
    });

    describe('Bicicleta.removeByCode', function() {
        it('inserta una instancia de bicicleta', async function(done) {
            var error = false;

            try {
                var bici = Bicicleta.createInstance(1,"verde", "urbana", [30,40]);

                await Bicicleta.add( bici );
                await Bicicleta.removeByCode( 1 );

                var allBicis = await Bicicleta.allBicis();
                expect(allBicis.length).toBe(0);

            } catch(err) {
                console.error(err);
                error = true;
            } finally {
                expect(error).not.toEqual(true, "No esperamos errores");     
                done();
            }
            
        })
    })

})





/*
beforeEach( () => {
    Bicicleta.allBicis = []
});

describe('Bicicleta.allBicis', () => {
    it('comienza vacía', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe("Bicicleta.add", () => {
    it('agregamos una', () => {
        expect(Bicicleta.allBicis.length).toBe(0);

        var bici = new Bicicleta(1, 'rojo', 'urbana', [0,0] );
        Bicicleta.add(bici);

        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(bici);
    });  
});

describe('Bicicleta.findById', () => {
    it('debe devolver la bici con id 1', () => {
        expect(Bicicleta.allBicis.length).toBe(0);

        var bici1 = new Bicicleta(1, 'verde', 'urbana', [0,0] );
        var bici2 = new Bicicleta(2, 'rojo', 'urbana', [0,0] );

        Bicicleta.add(bici1);
        Bicicleta.add(bici2);

        var targetBici = Bicicleta.findById(1);
        
        expect(Bicicleta.allBicis.length).toBe(2);

        expect(targetBici.id).toBe(1);
        
        expect(targetBici.color).toBe(bici1.color)
        expect(targetBici.modelo).toBe(bici1.modelo)
        expect(targetBici.ubicacion).toEqual(bici1.ubicacion)
        
    })
})

describe('Bicicleta.removeById', () => {
    it('debe devolver la bici con id 1', () => {

        expect(Bicicleta.allBicis.length).toBe(0);

        var bici1 = new Bicicleta(1, 'verde', 'urbana', [0,0] );
        var bici2 = new Bicicleta(2, 'rojo', 'urbana', [0,0] );

        Bicicleta.add(bici1);
        Bicicleta.add(bici2);

        Bicicleta.removeById(1);
        
        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0].id).toBe(2);        
    })
})*/