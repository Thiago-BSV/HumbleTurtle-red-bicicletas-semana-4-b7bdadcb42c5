const express = require('express');
const router = express.Router();


const passport = require('passport');

const authController = require('../../../mvc/controllers/local/auth')

const googleRouter = require('./modules/google')

router.get('/', (req, res, next ) => {
    res.redirect('/auth/login')
})

router.use('/google', googleRouter );

// registrarse
router.get('/registrarse', authController.registrarse );

// Solicitar el formulario para rellenarlo.
router.get('/login', authController.login_get );

// Postear los datos del formulario de login e iniciar sesión.
router.post('/login', authController.login_post );

// Cerrar sesión.
router.get('/logout', authController.logout_get );

// Paso 1, solicitar la token por correo
router.get('/solicitar-cambio-pass', authController.solicitarCambioPass_get );
router.post('/solicitar-cambio-pass', authController.solicitarCambioPass_post );

// Acceder con la token a través del enlace
router.post('/cambiar-contrasena', authController.cambiarContrasena_post );

module.exports = router;