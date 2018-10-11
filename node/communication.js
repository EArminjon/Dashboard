var widgetsTools = require(__dirname + "/widgets/weather.js");
var asyncRequest = require("request");

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
                    client.emit('addwidget', {html: html, id: option.id});
                else
                    callback(html);
            } else
                console.log("error html null");
        } else
            console.log("error url fail");
    });
};

var serverLister = function (app, client, request, callback) {
    var obj = null;
    switch (request.service) {
        case 'weather':
            obj = widgetsTools.weatherService(request.options);
            break;
        default :
            console.log("error service");
            return null;
    }
    if (obj != null && obj.function != null && obj.url != null)
        addWidgetWithUrl(app, client, obj, request.options, callback);
    else
        console.log("error widget");
};

var id = 0;

module.exports.communication = function(app, io) {
    io.on('connection', function (client) {
        console.log('Client connected...');
        client.on('join', function () {
            id += 1;
            serverLister(app, client, {service: 'weather', options: {city: 'Paris', degree: 'c', id: `widget_${id}`, nbDays: 7}}, null);
            id += 1;
            serverLister(app, client, {service: 'weather', options: {city: 'Londre', degree: 'c', id: `widget_${id}`, nbDays: 1}}, null);
            id += 1;
            serverLister(app, client, {service: 'weather', options: {city: 'Dubai', degree: 'c', id: `widget_${id}`, nbDays: 1}}, null);
        });

        client.on('addwidget', function (service) {
            id += 1;
            serverLister(app, client, {service: service, options: {city: 'Paris', degree: 'c', id: `widget_${id}`, nbDays: 1}}, null);
        });

        client.on('submit_form', function (data, callback) {
            console.log("submit");
            if (data != null && 'service' in data && 'options' in data && callback != null)
                serverLister(app, client, {service: data.service, options: data.options}, callback);
            else
                console.log("invalid submit");
        });
    });
}