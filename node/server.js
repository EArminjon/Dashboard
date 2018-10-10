const express = require('express');

const app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var asyncRequest = require("request");

app.set('view engine', 'ejs');

var widgetsTools = require(__dirname + "/weather.js");

function makeServer() {
    app.use(express.static(__dirname + '/public'));
    app.get('/', function (req, res) {

        var services = ['weather', 'news', 'sport', 'it', 'tv', 'radio'];
        res.render(__dirname + '/public/html/index.ejs', {
            services: services,
        });
    });
    app.get('/authent.html', function (req, res) {
        res.sendFile(__dirname + '/public/html/authent.html');
    });
    return server.listen(3000);
}

const Serv = makeServer();

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
            obj = widgetsTools.weatherService(request.urlOptions);
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

var id = 0;

io.on('connection', function (client) {
    console.log('Client connected...');

    client.on('join', function () {
        id += 1;
        serverLister(client, {service: 'weather', urlOptions: {city: 'Paris', degree: 'c'}, widgetOptions: {id: `widget_${id}`}}, null);
        id += 1;
        serverLister(client, {service: 'weather', urlOptions: {city: 'Londre', degree: 'c'}, widgetOptions: {id: `widget_${id}`}}, null);
        id += 1;
        serverLister(client, {service: 'weather', urlOptions: {city: 'Dubai', degree: 'c'}, widgetOptions: {id: `widget_${id}`}}, null);
    });

    client.on('addwidget', function (service) {
        id += 1;
        serverLister(client, {service: service, urlOptions: {city: 'Paris', degree: 'c'}, widgetOptions: {id: `widget_${id}`}}, null);
    });

    client.on('submit_form', function (data, callback) {
        if (data != null && 'service' in data && 'urlOptions' in data && 'widgetOptions' in data && callback != null)
            serverLister(client, {service: data.service, urlOptions: data.urlOptions, widgetOptions: data.widgetOptions}, callback);
    })

});

function abc() {
    return "abc";
}

module.exports = {
    Serv: Serv,
    abc: abc,
};