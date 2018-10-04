const express = require('express');

const app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

function makeServer() {

    app.use(express.static(__dirname + '/public'));

    app.get('/', function(req, res) {
            res.sendFile(__dirname + '/public/html/index.html');
        });

    app.get('/authent.html', function(req, res) {
            res.sendFile(__dirname + '/public/html/authent.html');
        });

    return server.listen(3000);
}

const Serv = makeServer();

io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
        client.emit('messages', 'Hello from server');
    });

    client.on('messages', function(data) {
           client.emit('broad', data);
           client.broadcast.emit('broad',data);
    });

});

function abc() {
    return "abc";
}

module.exports = {
    Serv: Serv,
    abc: abc
}