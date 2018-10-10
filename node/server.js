/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var asyncRequest = require("request");
var flash=require("connect-flash");
app.use(flash());


const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    genid: (req) => {
        console.log('Inside the session middleware')
      console.log(req.sessionID)
      return uuid() // use UUIDs for session IDs
    },
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))

app.get('/', (req, res) => {
  console.log(req.sessionID)
//   res.send(`You hit home page!\n`)
    res.redirect('/authrequired')
    // res.sendFile(__dirname + '/public/html/auth.html');
})
app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/error', (req, res) => res.send("error logging in"));



app.listen(3000 , () => console.log('App listening on port ' + 3000));

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

var addWidgetWithUrl = function (app, client, obj, option, callback) {
    asyncRequest(obj.url, function (error, response, body) {
        if (response.statusCode === 200) {
            var html = obj.function(body, app, option); //option for id
            if (html != null) {
                html = replaceAll(html, '\n', ' ');
                if (callback == null)
                    client.emit('addwidget', html);
                else
                    callback(html);
            } else
                console.log("error function null");
        } else
            console.log("error url fail");
    });
};

var serverLister = function (client, request, callback) {
    var obj = null;
    switch (request.service) {
        case 'weather':
            obj = widgetsTools.weatherService(request.widget, request.urlOptions);
            break;
        default :
            console.log("error service");
            return null;
    }
    if (obj.function != null && obj.url != null)
        addWidgetWithUrl(app, client, obj, request.widgetOptions, callback);
    else
        console.log("error widget");
};

/*  PASSPORT SETUP  */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
    console.log("added to login tout sa");

    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    console.log('Inside deserializeUser callback');
    console.log(`The user id passport saved in the session file store is: ${id}`);
    UserDetails.findById(id, function(err, user) {
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

const Schema = mongoose.Schema;
const UserDetail = new Schema({
    username: {type: String, unique:true},
    password: String,
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
passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    console.log('Inside passport.authenticate() callback');
    console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
    console.log(`req.user: ${JSON.stringify(req.user)}`)
    req.login(req.user, (err) => {
        console.log('Inside req.login() callback')
        console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
        console.log(`req.user: ${JSON.stringify(req.user)}`)
    })
      res.redirect('/success?username='+req.user.username);
  });


  /////////////////////////////////

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password'
    },
    function(username, password, done) {
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

app.post('/signup',
passport.authenticate('local-signup', { failureRedirect: '/' }),
function(req, res) {
  res.redirect('/success?username='+req.user.username);
});

app.get('/authrequired', (req, res) => {
    console.log('Inside GET /authrequired callback')
    console.log(`User authenticated? ${req.isAuthenticated()}`)
    if(req.isAuthenticated()) {
        console.log("GG");
      res.redirect('/success?username='+req.user.username);
    } else {
    res.sendFile(__dirname + '/public/html/auth.html');
    }
})

app.get('/logout', function(req, res){
    console.log("mdr");
    console.log(req.user);
    req.logout();
    res.redirect('/');
  });
// POUR ENGUEZZ
// client.on('join', function () {
//     serverLister(client, {service: 'weather', widget: 'today', urlOptions: {city: 'Paris', degree: 'c'}, widgetOptions: {id: 'widget_1'}}, null);
//     serverLister(client, {service: 'weather', widget: 'today', urlOptions: {city: 'Londre', degree: 'c'}, widgetOptions: {id: 'widget_2'}}, null);
//     serverLister(client, {service: 'weather', widget: 'today', urlOptions: {city: 'Dubai', degree: 'c'}, widgetOptions: {id: 'widget_3'}}, null);
//   });

// client.on('submit_form', function (data, callback) {
//         if (data != null && 'service' in data && 'widget' in data && 'urlOptions' in data && 'widgetOptions' in data && callback != null)
//             serverLister(client, {service: data.service, widget: data.widget, urlOptions: data.urlOptions, widgetOptions: data.widgetOptions}, callback);
//   });