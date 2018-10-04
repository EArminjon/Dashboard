const express = require('express');

const app = express();

function makeServer() {
    app.get('/', function(req, res) {
        res.setHeader('Content-Type', 'text/plain');
        res.sendFile(__dirname + '/public/html/index.html');
    });
    return app.listen(3000);
}

const Serv = makeServer();

function abc() {
    return "abc";
}

module.exports = {
    Serv: Serv,
    abc: abc
}