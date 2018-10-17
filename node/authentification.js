/* PASSPORT LOCAL AUTHENTICATION */
module.exports.authentification = function (app) {
    const UserDetails = require('./bdd');
    const passport = require('passport');

    const ServicePackage = require('./public/js/Service.js');
    const ServicesManager = require('./servicesManager.js').servicesManager();

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
        })
    );
    return passport;
};