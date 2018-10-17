const fs = require('fs');
const ejs = require('ejs');
const XML = require('pixl-xml');

var widget = function (xml, app, options) {
    var xmlArray = XML.parse(xml);

    let error = false;
    let date = null;
    let time = null;
    let city = null;
    if (xmlArray.error)
        error = true;
    else {
        let data = xmlArray.time_zone;
        let array = data.localtime.split(' ');
        date = array[0];
        time = array[1];
        array = data.zone.split('/');
        city = array[1];
    }

    var ejsfile = fs.readFileSync(__dirname + '/time_template.ejs', 'utf-8');
    return ejs.render(ejsfile, {
        ...options,
        error: error,
        time: time,
        date: date,
        city: city,
    });
};

function timeService(options) {
    let response = {url: null, function: null, header: null};

    response.url = `https://api.worldweatheronline.com/premium/v1/tz.ashx?key=fe4182d3fc444733893184315181710&q=${options.city}`;
    response.function = widget;
    return response;
}

function defaultOptions(id) {
    return {
        id: id,
        title: 'Time',
        city: 'Paris',
        refresh: 3600,

    };
}

module.exports = {
    functions: {service: timeService, defaultOptions: defaultOptions},
};

