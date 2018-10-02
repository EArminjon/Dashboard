// var http = require('http');

// var server = http.createServer(function(req, res) {
// 	res.writeHead(200);
// 	res.end('Wesh');
// });

// server.listen(3000);

var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Vous êtes à l\'accueil');
});

app.listen(3000);