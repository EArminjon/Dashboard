const express = require('express');

const app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.set('view engine', 'ejs');

var widgetsTools = require(__dirname + "/weather.js");

function makeServer() {

    app.use(express.static(__dirname + '/public'));

    app.get('/', function (req, res) {
        var widgets = [];
        widgets.push(widgetsTools.getWeather(app, "PARIS", 1));
        widgets.push(widgetsTools.getWeather(app, "BERLIN", 2));
        widgets.push(widgetsTools.getWeather(app, "MUNICH", 3));
        res.render(__dirname + '/public/html/index.ejs', {
            widgets: widgets,
        });
    });

    app.get('/authent.html', function (req, res) {
        res.sendFile(__dirname + '/public/html/authent.html');
    });

    return server.listen(3000);
}

const Serv = makeServer();

io.on('connection', function (client) {
    console.log('Client connected...');

    client.on('join', function (data) {
        console.log(data);
        client.emit('messages', 'Hello from server');
    });

    client.on('messages', function (data) {
        client.emit('broad', data);
        client.broadcast.emit('broad', data);
    });

});

function abc() {
    return "abc";
}

module.exports = {
    Serv: Serv,
    abc: abc,
};