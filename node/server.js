/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
const bodyParser = require('body-parser');
const session = require('express-session');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const ServicesManager = {
    'weather': require("./widgets/weather.js").functions,
    'stockMarket': require("./widgets/stockMarket.js").functions,
    'rss': require("./widgets/rss.js").functions,
};

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

server.listen(app.listen(8080, () => console.log('App listening on port ' + 8080)));

/*  PASSPORT SETUP  */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    UserDetails.UserDetails.findById(id, function (err, user) {
        cb(err, user);
    });
});

const mongoose = require('mongoose');
const url = "mongodb://robzzledieu:azerty123456@ds125423.mlab.com:25423/dashboard";

var db = mongoose.connect(url, {useNewUrlParser: true}, (err) => {
    if (err) {
        console.log("Fail on connect db");
    } else {
        console.log("Connected to db");
    }
});

const UserDetails = require('./bdd');
// console.log(UserDetails.getServices('a@a.fr', db));

//////////////////////////////

/* MONGOOSE SETUP */

/* COM */
require('./communication.js').communication(app, io);
const ServicePackage = require('./public/js/Service.js');

//////////////////////////////

/* PASSPORT LOCAL AUTHENTICATION */

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username, password, done) {
        UserDetails.UserDetails.findOne({
            username: username,
            password: password,
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (user.password != password) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

//////////////////////////////
app.post('/login',
    passport.authenticate('local', {failureRedirect: '/'}),
    function (req, res) {
        res.redirect('/success?username=' + req.user.username);
    });


/////////////////////////////////

passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {
        UserDetails.UserDetails.findOne({username: username}, function (err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, false);
            } else {
                var newUser = new UserDetails.UserDetails();
                newUser.username = username;
                newUser.password = password;
                var obj1 = new ServicePackage.Service("weather", ServicesManager['weather'].defaultOptions(1), null);
                /*var obj2 = new ServicePackage.Service("rss", ServicesManager['rss'].defaultOptions(2), null);*/
                /*newUser.services = [obj1, obj2];*/
                newUser.services = [obj1];

                newUser.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    return done(null, newUser);
                });
            }
        });
}));

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
    var services = ['weather', 'rss', 'sport', 'it', 'tv', 'radio'];
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
    LocalStrategy: LocalStrategy
}