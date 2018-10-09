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
        widgets.push(widgetsTools.getWeather(app, "PARIS", "widget_1"));
        widgets.push(widgetsTools.getWeather(app, "BERLIN", "widget_2"));
        widgets.push(widgetsTools.getWeather(app, "MUNICH", "widget_3"));
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

weatherList = function (data, result) {
    var widgetName = data.widget;
    switch (widgetName) {
        case 'today':
            console.log(data.options);
            result.data = widgetsTools.getWeather(app, data.options.city, data.options.id);
            return result;
        default:
            result.error = 'error: widget not found';
            return result;
    }
};

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

    client.on('submit_form', function (data, callback) {

        var service = data.service;
        var result = {
            'error': '',
            'data': '',
        };
        switch (service) {
            case 'weather':
                result = weatherList(data, result);
                break;
            default :
                return callback('error: service not found', result);
        }
        callback('', result);
    })

});

function abc() {
    return "abc";
}

module.exports = {
    Serv: Serv,
    abc: abc,
};