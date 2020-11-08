var express = require('express');
var router = express.Router();

var bicicletaController = require('../../mvc/controllers/api/bicicletaControllerAPI');
const permisosMiddleware = require('../permisos');

router.get('/', bicicletaController.bicicleta_list );
router.post('/create', permisosMiddleware.validarUsuario, bicicletaController.bicicleta_create );

router.post('/:code/update',permisosMiddleware.validarUsuario, bicicletaController.bicicleta_update );
router.put('/:code/update', permisosMiddleware.validarUsuario, bicicletaController.bicicleta_update );

/* Post y delete para las pruebas */
router.post('/:code/delete', permisosMiddleware.validarUsuario, bicicletaController.bicicleta_delete );
router.delete('/:code/delete', permisosMiddleware.validarUsuario, bicicletaController.bicicleta_delete );

module.exports = router;