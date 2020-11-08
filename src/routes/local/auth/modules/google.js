const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/',
    passport.authenticate('google', { scope: [
        'profile',
        'email']
    })
);

router.get('/success',  function(req, res, next) {
        res.redirect('/');
    }
);

router.get('/callback', passport.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/login'
}));

module.exports=router;