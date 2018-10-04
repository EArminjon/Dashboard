const express = require('express');

const app = express();

function makeServer() {
    app.use(express.static(__dirname + '/public'));
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/html/index.html');
        });

    app.get('/authent.html', function(req, res) {
        res.sendFile(__dirname + '/public/html/authent.html');
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