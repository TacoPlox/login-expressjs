var express = require('express');
const passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/',function (req,res,next) {
    res.render('index',{ title: 'Express' });
});

router.get('/login',(req,res,next) => {
    return res.render('login');
});

router.post('/login',passport.authenticate('local',(err,user,info) => {

}));

router.get('/register',(req,res,next) => {
    return res.render('register');
});

router.post('/register',(req,res,next) => {
    let username = req.body.username;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    if (!username || username === '' || !password || password === '') {
        //Incomplete values
        res.render('register', {errorMessage: 'Please type a username and a password'});
    }
    
    if (password !== confirmPassword) {
        //Passwords do not match!
        res.render('register', {errorMessage: 'Passwords must match'});
    }
});

module.exports = router;
