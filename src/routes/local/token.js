const express = require('express');
const router = express.Router();

const tokenController = require('../../mvc/controllers/local/token');

/* GET users listing. */
router.get( '/confirmacion/:token', tokenController.confirmacion_get );
router.get( '/recuperar-contrasena/:token', tokenController.recuperarContrasena_get )

module.exports = router;
