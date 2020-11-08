const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');

const Usuario = require('../mvc/models/usuario');

passport.use( new LocalStrategy( {usernameField:'email', passwordField:'password'},
    async (email, password, done) => {   
        try {
            var usuario = await Usuario.findOne( {email} );

            if (!usuario) {
                return done(null, false, {message:'Email no existente o incorrecto.'});
            }
    
            //Si se encuentra al usuario
            if(  !usuario.validPassword(password) ) {                
                return done(null, false, {message:'Password inválido.'});
            }

            return done(null, usuario);
        
        } catch(error) {
            console.log(error);
            return done(error);
        }        
    }
));

passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET
  },
  function(accessToken, refreshToken, profile, done) {
        try{
            Usuario.findOneOrCreateByFacebook(profile, function(err, user){
                return done(err, user);
            })

        } catch(error) {
            console.log("error");
            return done(err2, null)
        }
  }
));

passport.use( new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: process.env.HOST+'/auth/google/callback'},
    
    function( accessToken, refreshToken, profile, callback) {
        try{
            console.log(profile);
        
            Usuario.findOneOrCreateByGoogle(profile, function(err, user){
                return callback(err, user);
            })
    
        } catch(error) {
            console.log(error);
        }

    }
))

passport.serializeUser( function(user, callback) {
    callback(null, user.id );
} )


passport.deserializeUser( function(id, callback) {
    Usuario.findById(id, function(err, usuario) {
        callback(err, usuario);
    });
});


module.exports = passport;