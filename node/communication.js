var asyncRequest = require("request");
var weatherService = require("./widgets/weather.js").weatherService;
var stockMarketService = require("./widgets/stockMarket.js").stockMarketService;
const ServicePackage = require('./public/js/Service.js');

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

var addWidgetWithUrl = function (app, client, obj, Service, callback) {
    asyncRequest(obj.url, function (error, response, body) {
        if (response.statusCode === 200) {
            var html = obj.function(body, app, Service.options);
            if (html != null) {
                html = replaceAll(html, '\n', ' ');
                if (callback == null)
                    client.emit('addwidget', {html: html, Service: Service});
                else
                    callback(html);
            } else
                console.log("error html null");
        } else
            console.log("error url fail");
    });
};

var serverLister = function (app, client, Service, callback) {
    var obj = null;
    switch (Service.service) {
        case 'weather':
            obj = weatherService(Service.options);
            break;
        case 'stockMarket':
            obj = stockMarketService(Service.options);
            break;
        default :
            console.log("error service");
            return null;
    }
    if (obj != null && obj.function != null && obj.url != null)
        addWidgetWithUrl(app, client, obj, Service, callback);
    else
        console.log("error widget");
};

var id = 0;

module.exports.communication = function (app, io) {
    io.on('connection', function (client) {
        console.log('Client connected...');
        client.on('join', function () {
            id += 1;
            serverLister(app, client, new ServicePackage.Service('stockMarket', {city: 'Paris', degree: 'c', id: `widget_${id}`, nbDays: 1, refresh: 3}, new ServicePackage.Position(1, 1, 2, 2)), null);
            id += 1;
            serverLister(app, client, new ServicePackage.Service('weather', {city: 'Paris', degree: 'c', id: `widget_${id}`, nbDays: 7, refresh: 3}, new ServicePackage.Position(3, 1, 2, 2)), null);
            id += 1;
            serverLister(app, client, new ServicePackage.Service('weather', {city: 'Londre', degree: 'f', id: `widget_${id}`, nbDays: 1, refresh: 3}, new ServicePackage.Position(5, 1, 2, 2)), null);
            id += 1;
            serverLister(app, client, new ServicePackage.Service('weather', {city: 'Dubai', degree: 'c', id: `widget_${id}`, nbDays: 1, refresh: 3}, null), null);
        });

        client.on('addwidget', function (service) {
            id += 1;
            //pas besoin de la position, le gridster se demerde
            //en vrai faudra appeler une methode provenant du service pour générer les params par défaut
            serverLister(app, client, new ServicePackage.Service(service, {city: 'Paris', degree: 'c', id: `widget_${id}`, nbDays: 1, refresh: 3}, null), null);
        });

        client.on('updatePosition', function (object) {
            console.log("POSITION");
            /*console.log(object.positions); //testé et on a tout*/
        });

        client.on('submit_form', function (Service, callback) {
            console.log("submit");
            if (Service != null && 'service' in Service && 'options' in Service && Service.positions !== null && callback != null)
                serverLister(app, client, Service, callback);
            else
                console.log("invalid submit");
        });
    });
};