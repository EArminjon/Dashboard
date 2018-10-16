var asyncRequest = require("request");
const ServicesManager = {
    'weather': require("./widgets/weather.js").functions,
    'stockMarket': require("./widgets/stockMarket.js").functions,
    'rss': require("./widgets/rss.js").functions,
};
const ServicePackage = require('./public/js/Service.js');

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

var addWidgetWithUrl = function (app, client, obj, Service, callback) {
    asyncRequest(obj.url, function (error, response, body) {
        if (response !== null && typeof(response) !== 'undefined' && 'statusCode' in response && response.statusCode === 200) {
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
    Object.keys(ServicesManager).forEach(function (key) {
        if (Service.service === key) {
            obj = ServicesManager[key].service(Service.options);
        }
    });
    if (obj === null) {
        console.log("error service");
        return null;
    }

    if (obj != null && obj.function != null && obj.url != null)
        addWidgetWithUrl(app, client, obj, Service, callback);
    else
        console.log("error widget");
};

var id = 0;

const UserDetails = require('./bdd');

module.exports.communication = function (app, io) {
    io.on('connection', function (client) {
        console.log('Client connected...');
        client.on('join', function (username) {
            client["ClientID"] = username;
            console.log(client.ClientID);

            UserDetails.getServices(username).then(function(result) {
                // for (var i = 0 ; result.services[i]; ++i) {
                //     console.log(result.services[i].service);
                // }

            });



            console.log("HERE");

            /*id += 1;
            serverLister(app, client, new ServicePackage.Service('stockMarket', {city: 'Paris', degree: 'c', id: `widget_${id}`, nbDays: 1, refresh: 3}, new ServicePackage.Position(1, 1, 2, 2)), null);*/
            id += 1;
            serverLister(app, client, new ServicePackage.Service('rss', {id: `widget_${id}`, title:'LeMonde', url: `https://www.lemonde.fr/rss/une.xml`, limit: 2, refresh: 3}, new ServicePackage.Position(3, 1, 2, 2)), null);
            id += 1;
            /*serverLister(app, client, new ServicePackage.Service('weather', {city: 'Londre', degree: 'f', id: `widget_${id}`, nbDays: 1, refresh: 3}, new ServicePackage.Position(5, 1, 2, 2)), null);
            id += 1;
            serverLister(app, client, new ServicePackage.Service('weather', {city: 'Dubai', degree: 'c', id: `widget_${id}`, nbDays: 1, refresh: 3}, null), null);*/
        });

        client.on('addwidget', function (serviceName) {
            id += 1;

            var options = null;
            Object.keys(ServicesManager).forEach(function (key) {
                if (serviceName === key) {
                    options = ServicesManager[key].defaultOptions(id);
                }
            });
            if (options === null) {
                console.log("error service 2");
                return null;
            }

            serverLister(app, client, new ServicePackage.Service(serviceName, options, null), null);
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