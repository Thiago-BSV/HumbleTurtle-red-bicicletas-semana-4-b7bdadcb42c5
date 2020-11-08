const express = require("express");

const permisosMiddleware = require('../permisos');


var router = express.Router();
var bicicletaController = require("../../mvc/controllers/local/bicicleta");


router.get("/", permisosMiddleware.loggedIn, bicicletaController.bicicleta_list );

router.get("/create", permisosMiddleware.loggedIn, bicicletaController.bicicleta_create );
router.post("/create", permisosMiddleware.loggedIn, bicicletaController.bicicleta_create_post );
router.post("/:code/delete", permisosMiddleware.loggedIn, bicicletaController.bicicleta_delete_post );

router.get("/:code/update", permisosMiddleware.loggedIn, bicicletaController.bicicleta_update );
router.post("/:code/update", permisosMiddleware.loggedIn, bicicletaController.bicicleta_update_post );

module.exports = router;