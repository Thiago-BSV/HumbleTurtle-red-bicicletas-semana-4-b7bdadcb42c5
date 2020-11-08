const express = require('express');
const path = require('path');

// Subrutas
var indexRouter = require('./local/index');
var bicicletasRouter = require('./local/bicicletas');
var usuariosRouter = require('./local/usuarios');
var tokenRouter = require('./local/token');

var authRouter = require('./local/auth/auth');

var router = express.Router();

// Mapeamos las rutas con subrutas

router.use('/auth',  authRouter );
router.use('/bicicletas',  bicicletasRouter);
router.use('/usuarios', usuariosRouter);
router.use('/token', tokenRouter);
router.use('/', indexRouter);

module.exports = router;