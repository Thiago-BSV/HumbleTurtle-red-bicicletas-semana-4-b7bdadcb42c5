const express = require("express");

const permisosMiddleware = require('../permisos');

var router = express.Router();
var usuarioController = require("../../mvc/controllers/local/usuario");


router.get("/", permisosMiddleware.loggedIn, usuarioController.usuario_list );

router.get("/create", permisosMiddleware.loggedIn, usuarioController.usuario_create );
router.post("/create", usuarioController.usuario_create_post );

router.post("/:id/delete", permisosMiddleware.loggedIn, usuarioController.usuario_delete_post );

router.get("/:id/update", permisosMiddleware.loggedIn, usuarioController.usuario_update );
router.post("/:id/update", permisosMiddleware.loggedIn, usuarioController.usuario_update_post );

module.exports = router;