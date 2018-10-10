/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.sendFile(__dirname + '/public/html/auth.html'));
app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/error', (req, res) => res.send("error logging in"));

app.listen(3000 , () => console.log('App listening on port ' + 3000));

// const express = require('express');
// const app = express();
// const bodyParser = require("body-parser");

// var server = require('http').createServer(app);
// var io = require('socket.io')(server);
// var widgetsTools = require(__dirname + "/weather.js");

/*  PASSPORT SETUP  */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});

//////////////////////////////

/* MONGOOSE SETUP */

const mongoose = require('mongoose');
const url = "mongodb://robzzledieu:azerty123456@ds125423.mlab.com:25423/dashboard";

mongoose.connect(url, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log("Fail on connect db");
    } else {
        console.log("Connected to db");
    }
});

// const user = mongoose.Schema({
//     username: {
//         type: String,
//         unique: true
//     },
//     password: String,
// })

// const model = mongoose.model('User', user);

const Schema = mongoose.Schema;
const UserDetail = new Schema({
      username: {type: String, unique:true},
      password: String
    });
const UserDetails = mongoose.model('User', UserDetail);

//////////////////////////////

/* PASSPORT LOCAL AUTHENTICATION */

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
      UserDetails.findOne({
        username: username,
        password: password
      }, function(err, user) {
        // console.log(user);
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
app.post('/',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success?username='+req.user.username);
  });


/////////////////////////////////

passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password'
    },
    function(username, password, done) {
        console.log("mdr");
        UserDetails.findOne({ username: username }, function(err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, false);
            } else {
                var newUser = new UserDetails();
                newUser.username    = username;
                newUser.password = password;

                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

	});
}));

  app.post('/a',
passport.authenticate('local-signup', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success?username='+req.user.username);
  });
