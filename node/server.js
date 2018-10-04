const express = require('express');

const app = express();

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(__dirname + '/public/html/index.html');
});

app.listen(3000);