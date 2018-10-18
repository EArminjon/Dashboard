const ServicesManager = require('./servicesManager.js').servicesManager();
const fs = require('fs');

function getUnixTime() {
    Date.prototype.toUnixTime = function () {
        return this.getTime() / 1000 | 0
    };
    Date.time = function () {
        return new Date().toUnixTime();
    };
    return Date.time();
}

module.exports.router = function (app, passport) {
    /* ROUTE */
    app.get('/about.json', (req, res) => {
        const about = JSON.parse(fs.readFileSync(__dirname + '/about.json', 'utf8'));

        console.log(req.ip);
        about.client.host = req.ip.split(':').pop();
        about.server.current_time = getUnixTime();
        res.send(about);
    });

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
};