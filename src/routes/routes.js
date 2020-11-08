var express = require('express');
var path = require('path');

// Subrutas, rutas relativas
var routesAPI = require('./routesAPI');
var routesLocal = require('./routesLocal');

const url = require('url');

function fullUrl(req) {
    return url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: req.originalUrl
    });
}

function ensureInsecure(req, res, next){
    if(req.secure){
      // OK, continue
      return next();
    };
    // handle port numbers if you need non defaults
    // res.redirect('https://' + req.host + req.url); // express 3.x
    res.redirect('http://' + req.hostname + req.url); // express 4.x
  }

exports.register = function(app) {
    // Ruta estatica
    app.use(express.static(path.join('./src','static')));

    app.all("*", function (req, resp, next) {
        console.log(fullUrl(req)); // do anything you want here
        next();
     });

    app.use('/politica-de-privacidad', function(req, res) {
        res.sendfile('src/static/politicaprivacidad.html');
    });


    // Registramos el router del API
    app.use('/api', routesAPI );

    // Registramos el router local
    app.use('/', routesLocal );
}