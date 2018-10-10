/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var asyncRequest = require("request");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.sendFile(__dirname + '/public/html/auth.html'));
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

client.on('join', function () {
    serverLister(client, {service: 'weather', widget: 'today', urlOptions: {city: 'Paris', degree: 'c'}, widgetOptions: {id: 'widget_1'}}, null);
    serverLister(client, {service: 'weather', widget: 'today', urlOptions: {city: 'Londre', degree: 'c'}, widgetOptions: {id: 'widget_2'}}, null);
    serverLister(client, {service: 'weather', widget: 'today', urlOptions: {city: 'Dubai', degree: 'c'}, widgetOptions: {id: 'widget_3'}}, null);
    client.on('submit_form', function (data, callback) {
        if (data != null && 'service' in data && 'widget' in data && 'urlOptions' in data && 'widgetOptions' in data && callback != null)
            serverLister(client, {service: data.service, widget: data.widget, urlOptions: data.urlOptions, widgetOptions: data.widgetOptions}, callback);
    })
