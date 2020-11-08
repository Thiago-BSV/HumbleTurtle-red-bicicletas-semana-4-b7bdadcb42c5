var express = require('express');
var router = express.Router();

var passport = require('passport');

var authControllerAPI = require('../../mvc/controllers/api/authControllerAPI');

router.post('/forgotPassword', authControllerAPI.forgotPassword );
router.post('/authenticate', authControllerAPI.authenticate );
router.post('/facebook_token', passport.authenticate('facebook-token', { scope:['email'] } ), authControllerAPI.authFacebookToken );

module.exports = router;