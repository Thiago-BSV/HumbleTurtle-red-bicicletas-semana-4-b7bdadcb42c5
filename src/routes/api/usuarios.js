var express = require('express');
var router = express.Router();

var usuarioController = require('../../mvc/controllers/api/usuarioControllerAPI');


router.get('/', usuarioController.usuarios_list );
router.post('/create', usuarioController.usuario_create );
router.post('/reservar', usuarioController.usuario_reservar );


/**
 * 
 * 
 * 
 * 
 * 
router.get('/', bicicletaController.bicicleta_list );
router.post('/create', bicicletaController.bicicleta_create );

router.post('/:code/update', bicicletaController.bicicleta_update );
router.put('/:code/update', bicicletaController.bicicleta_update );

// Post y delete para las pruebas 
router.post('/:code/delete', bicicletaController.bicicleta_delete );
router.delete('/:code/delete', bicicletaController.bicicleta_delete );

 * 
*/

module.exports = router;