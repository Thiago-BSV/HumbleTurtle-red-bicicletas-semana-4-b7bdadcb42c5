require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');



const passport = require('./config/passport');
const session = require('express-session');

const mongoose = require('mongoose');
const mongoDB = process.env.MONGO_URI;

const MongoDBStore = require('connect-mongodb-session')(session);

let store;

if( process.env.NODE_ENV == 'development' ) {
  store = new session.MemoryStore;
} else {
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  });

  store.on('error', function(error){
    assert.ifError(error);
    assert.ok(false);
  });
}

conectar_base_de_datos( mongoose, mongoDB , app );

// Registramos las rutas en otro archivo para tener mejor orden en el app.js
// Dividimos las rutas en dos archivos router
// routes/routesAPI.js <- Contiene las rutas del api
// routes/routesLocal.js <- Contiene las rutas del api
// routes/routes.js <- Importa ambos archivos
var routes = require('./routes/routes.js');
const { assert } = require('console');

var app = express();

// Instalamos el view manager
instalar_vistas( app );

// Configuramos el app
configurar_app( app );

// Registramos las rutas
routes.register(app);

// Registramos el manejador de errores
instalar_manejador_errores(app);

function conectar_base_de_datos( mongoose, mongoDB , app ) {

  mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
  mongoose.set('useCreateIndex', true);
  
  mongoose.Promise = global.Promise;
  
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error: '));

}

function instalar_manejador_errores(app) {
 
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
} 

function instalar_vistas (app) {
  // view engine setup
  app.set('views', path.join(__dirname, 'mvc', 'views'));
  app.set('view engine', 'pug');
}

function configurar_app (app){



  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.set('secretKey', 'jwt_pwd!23123123123121a8Pfskl');

  app.use(session({
    cookie: {maxAge: 240 * 60 * 60 * 1000 },
    store: store,
    saveUninitialized: true,
    resave: 'true',
    secret: 'red_bicis!!____!!!____!!!___!!__!_!_!_!!!!!!!'
  }));

  app.use(passport.initialize());
  app.use(passport.session());
}

module.exports = app;
