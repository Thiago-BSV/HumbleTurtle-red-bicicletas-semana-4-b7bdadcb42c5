# Uso
    git clone https://HumbleTurtle@bitbucket.org/HumbleTurtle/red-bicicletas.git

## Iniciar
    npm run devstart

## Tests
    num run test

# Rutas
        GET     /
                Página principal
### Auth

        GET     /auth/google
                Inicia el proceso de autenticación por google a través de passport
        
        GET     /auth/callback
                Recibe la respuesta y crea o inicia sesión a través de passport

        POST    /auth/facebook_token
                Recibe "token_access" e inicia sesión o crea una cuenta a través de passport

        GET     /auth/login
                Ingresar    

        POST    /auth/login
                Procesa los datos del formulario de ingreso y crea la sesión    

        GET     /auth/logout
                Cerrar sesión    

        GET     /auth/registrarse
                Nueva cuenta

        GET     /auth/solicitar-cambio-pass
                Solicitar un correo electrónico para cambio de contraseña    
    
        POST    /auth/solicitar-cambio-pass
                Procesar la solicitid con los datos enviados por post
        
        POST    /auth/cambiar-contrasena
                Procesa los datos del formulario de cambio de contraseña

                Recibe el token a través de un campo oculto en el formulario.
                
### Token
        GET     /token/recuperar-contrasena/:token
                Recibe un token y renderiza el formulario de cambio de contraseña con el campo token oculto.
        
        GET     /token/confirmacion/:token


### Usuarios
        GET     /usuarios
                Lista de usuarios

        GET     /usuarios/create
                Formulario de creación de usuario
        
        POST    /usuarios/create
                Procesa los datos recibidos por post y crea el usuario

        GET     /usuarios/:id/update
                Formulario de modificación de usuario
        
        POST    /usuarios/:id/update
                Procesa los datos recibidos por post y modifica el usuario
        
        POST    /usuarios/:id/delete
                Elimina el usuario con id :id

### Bicicletas
        GET     /bicicletas
                Lista de bicicletas

        GET     /bicicletas/create
                Formulario de creación

        POST    /bicicletas/create
                Recibe los datos del formulario de creación y crea la bicicleta.
        
        GET     /bicicletas/:code/update
                Formulario de edición

        POST    /bicicletas/:code/update
                Datos en formato json posteados al uri

        POST    /bicicletas/:code/delete
                Borrado del elemento codeg

            
# Endpoints API
        POST    /api/auth/authenticate
                Login

                content-type: application/json o x-www-form-urlencoded
                email : email

                password : password

        POST    /api/auth/forgotPassword
                Recibir email de contraseña

                content-type: application/json o x-www-form-urlencoded
                email : email

        GET     /api/bicicletas

        POST    /api/bicicletas/create
                Para postman usar body con formato x-www-form-urlencoded

                content-type: application/json o x-www-form-urlencoded
                code : code bicicleta
                color  : color de la bicicleta
                modelo : modelo de la bicicleta
                lng : longitud de la coordenada
                lat : latitud de la coordenada

        POST    /api/bicicletas/:id/update
                Enviar datos como params en postman.

                content-type: application/json o x-www-form-urlencoded
                code : code bicicleta.

        POST    /api/bicicletas/:id/delete
                Enviar datos como params en postman.

