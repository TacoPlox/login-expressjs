var express = require('express');
const passport = require('passport');
var router = express.Router();

const { User } = require('./../models/user');

/* GET home page. */
router.get('/',function (req,res,next) {
    res.render('index',{ title: 'Login test' });
});

let checkLogin = (req, res, next) => {
    //Revisar si la sesión de usuario existe
    let isLoggedIn = req.user;

    //Si existe, continúa al siguiente middleware
    if (isLoggedIn) {
        return next();
    }

    //Si no existe, enviar al usuario a la página principal
    return res.redirect('/login');
};

router.get('/home', checkLogin, function (req,res,next) {
    res.render('home', {
        user: req.user
    });
});

router.get('/login',(req,res,next) => {
    return res.render('login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local',(err,user,info) => {
        console.log('user', JSON.stringify(user));
        //{message: 'Invalid username or password'} => info
    
        //Si hubo un error, o si no hay un usuario para el username+password introducidos
        if (err || !user) {
            
            return res.render('login', {
                errorMessage: info.message || 'Error trying to login. Please try again'
            });
        }

        req.login(user,function (err) {
            if (err) { return next(err); }
            return res.redirect('/home');
        });
    
        // return res.redirect('/home');
    })(req, res, next);
});

router.get('/register',(req,res,next) => {
    return res.render('register');
});

router.get('http://localhost:3000/auth/facebook/callback', (req, res, next) => {
    
});

router.post('/register',(req,res,next) => {
    //Extraer valores del formulario
    let username = req.body.username;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    //Verificar que los campos no vengan vacíos
    if (!username || username === '' || !password || password === '') {
        //Incomplete values
        res.render('register',{
            errorMessage: 'Please type a username and a password',
            username,
            password,
            confirmPassword,
        });
    }

    //Verificar que el password y su confirmación coincidan
    if (password !== confirmPassword) {
        //Passwords do not match!
        res.render('register',{
            errorMessage: 'Passwords must match',
            username,
            password,
            confirmPassword,
        });
    }

    //Crear objeto con estructura de modelo
    let userToCreate = {
        username: username,
        password: User.generateHash(password)
    };

    //Habilitar palabra "await"
    try {
        (async () => {
            let user = await User.create(userToCreate);

            req.login(user,function (err) {
                if (err) { return next(err); }
                return res.redirect('/home');
            });

            // return res.render('login',{ successMessage: 'User created successfully. Please login to continue.' });
        })();
    } catch (err) {
        console.error('Error al intentar crear User',err);
        res.render('register',{
            errorMessage: 'An unexpected error occurred',
            username,
            password,
            confirmPassword,
        });
    }
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
