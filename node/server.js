/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
const bodyParser = require('body-parser');
const session = require('express-session');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const ServicesManager = require('./servicesManager.js').servicesManager();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

server.listen(app.listen(8080, () => console.log('App listening on port ' + 8080)));

require('./communication.js').communication(app, io);
const passport = require('./authentification.js').authentification(app);

/* ROUTE */
app.post('/login',
    passport.authenticate('local', {failureRedirect: '/'}),
    function (req, res) {
        res.redirect('/success?username=' + req.user.username);
    });

app.post('/signup',
    passport.authenticate('local-signup', {failureRedirect: '/signup'}),
    function (req, res) {
        res.redirect('/success?username=' + req.user.username);
    });

app.get('/', isLoggedIn, (req, res) => {
    res.sendFile(__dirname + '/public/html/login.html');
});

app.get('/signup', isLoggedIn, (req, res) => {
    res.sendFile(__dirname + '/public/html/signup.html');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/success');
    }
    return next();
}

app.get('/success', isNotLogged, (req, res) => {
    let services = [];

    for (let service in ServicesManager) {
        services.push(service);
    }
    res.render(__dirname + '/public/html/index.ejs', {
        services: services,
        clientName: req.user.username,
    });
});

function isNotLogged(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

app.get('/error', (req, res) => res.send("error logging in"));

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = {
    passport: passport,
};