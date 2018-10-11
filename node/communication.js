var asyncRequest = require("request");
var weatherService = require(__dirname + "/widgets/weather.js").weatherService;
var stockMarketService = require(__dirname + "/widgets/stockMarket.js").stockMarketService;

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
                    client.emit('addwidget', {html: html, id: option.id, positions: option.position});
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
            obj = weatherService(request.options);
            break;
        case 'stockMarket':
            obj = stockMarketService(request.options);
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

module.exports.communication = function (app, io) {
    io.on('connection', function (client) {
        console.log('Client connected...');
        client.on('join', function () {
            id += 1;
            serverLister(app, client, {service: 'stockMarket', options: {position: {col: 1, row: 1, sizex: 2, sizey: 2}, city: 'Paris', degree: 'c', id: `widget_${id}`, nbDays: 1}}, null);
            id += 1;
            serverLister(app, client, {service: 'weather', options: {position: {col: 3, row: 1, sizex: 2, sizey: 2}, city: 'Paris', degree: 'c', id: `widget_${id}`, nbDays: 7}}, null);
            id += 1;
            serverLister(app, client, {service: 'weather', options: {position: {col: 5, row: 1, sizex: 2, sizey: 2}, city: 'Londre', degree: 'c', id: `widget_${id}`, nbDays: 1}}, null);
            id += 1;
            serverLister(app, client, {service: 'weather', options: {position: {col: 7, row: 1, sizex: 2, sizey: 2}, city: 'Dubai', degree: 'c', id: `widget_${id}`, nbDays: 1}}, null);
        });

        client.on('addwidget', function (service) {
            id += 1;
            //pas besoin de la position, le gridster se demerde
            serverLister(app, client, {service: service, options: {city: 'Paris', degree: 'c', id: `widget_${id}`, nbDays: 1}}, null);
        });

        client.on('updatePosition', function(object) {
            /*console.log(object);*/ //testé et on a tout
        });

        client.on('submit_form', function (data, callback) {
            console.log("submit");
            if (data != null && 'service' in data && 'options' in data && 'positions' in data && callback != null)
                serverLister(app, client, data, callback);
            else
                console.log("invalid submit");
        });
    });
};