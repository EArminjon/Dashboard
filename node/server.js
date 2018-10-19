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
app.use(express.static(__dirname + '/node_modules'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

var port = process.env.PORT || 8080;

server.listen(app.listen(port, () => console.log('App listening on port ' + port)));

require('./communication.js').communication(app, io);
const passport = require('./authentification.js').authentification(app);
require('./route.js').router(app, passport);