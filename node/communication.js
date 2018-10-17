const asyncRequest = require("request");
const ServicesManager = require('./servicesManager.js').servicesManager();
const ServicePackage = require('./public/js/Service.js');

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function getAndSendHtml(app, client, obj, Service, callback, body) {
    let html = obj.function(body, app, Service.options);
    if (html != null) {
        html = replaceAll(html, '\n', ' ');
        if (callback == null)
            client.emit('addWidget', {html: html, Service: Service});
        else
            callback(html);
    } else
        console.log("error html null");
}

function addWidgetWithUrl(app, client, obj, Service, callback) {
    asyncRequest(obj.url, {headers: obj.header}, function (error, response, body) {
        if (response !== null && typeof(response) !== 'undefined' && 'statusCode' in response && response.statusCode === 200) {
            getAndSendHtml(app, client, obj, Service, callback, body);
        } else {
            console.log(response);
            console.log(obj.url);
            console.log("error url fail");
        }
    });
}

function serverLister(app, client, Service, callback) {
    let obj = null;
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
    else if (obj != null && obj.function != null && obj.url == null)
        getAndSendHtml(app, client, obj, Service, callback, null);
    else
        console.log("error widget");
}

const UserDetails = require('./bdd');

module.exports.communication = function (app, io) {
    io.on('connection', function (client) {
        console.log('Client connected...');

        client.on('join', function (username) {
            client["ClientID"] = username;
            client["ClientWidgetID"] = 0;
            UserDetails.getServices(username).then(function (result) {
                for (let i = 0; result.services[i]; ++i) {
                    /*console.log(result.services[i]);*/
                    console.log("ID:" + result.services[i].options.id);
                    if (result.services[i].options.id > client.ClientWidgetID)
                        client.ClientWidgetID = result.services[i].options.id;
                    serverLister(app, client, result.services[i], null);
                }
            });
        });

        client.on('removeWidget', function (Service) {
            /*console.log(Service);*/
            UserDetails.removeWidget(client.ClientID, Service);
        });

        client.on('addwidget', function (serviceName) {
            client.ClientWidgetID += 1;
            let options = null;
            Object.keys(ServicesManager).forEach(function (key) {
                if (serviceName === key) {
                    options = ServicesManager[key].defaultOptions(client.ClientWidgetID);
                }
            });
            if (options === null) {
                console.log(serviceName + " add widget option null");
                return null;
            }

            let service = new ServicePackage.Service(serviceName, options, null);
            UserDetails.addWidget(client.ClientID, service);
            serverLister(app, client, service, null);
        });

        client.on('updatePosition', function (service) {
            if (!('service' in service && 'options' in service && 'positions' in service)) {
                console.log(service);
                console.log("Update Position fail, bad argument.");
                return;
            }
            UserDetails.changeWidget(client.ClientID, service);
        });

        client.on('submit_form', function (Service, callback) {
            console.log("submit");
            if (Service != null && 'service' in Service && 'options' in Service && Service.positions !== null && callback != null) {
                UserDetails.changeWidget(client.ClientID, Service);
                serverLister(app, client, Service, callback);
            } else {
                console.log("invalid submit");
            }
        });
    });
};