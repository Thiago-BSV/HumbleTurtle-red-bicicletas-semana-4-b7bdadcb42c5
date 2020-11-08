const express = require('express');
const path = require('path');

const router = express.Router();


// Subrutas
var bicicletasAPIRouter = require('./api/bicicletas');
var usuariosAPIRouter = require('./api/usuarios');
var tokenAPIRouter = require('./api/token');

router.use("/bicicletas", bicicletasAPIRouter );
router.use("/usuarios", usuariosAPIRouter );
router.use("/auth", tokenAPIRouter );



module.exports = router;