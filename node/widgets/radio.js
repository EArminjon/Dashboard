const fs = require('fs');
const ejs = require('ejs');

var widget = function (json, app, options) {
    var ejsfile = fs.readFileSync(__dirname + '/radio_template.ejs', 'utf-8');

    console.log("radio");
    return ejs.render(ejsfile, {
        ...options,
    });
};

function radioService(option) {
    var response = {url: null, function: null,};

    response.function = widget;
    return response;
}

function defaultOptions(id) {
    return {
        id: id,
        title: 'FunRadio',
        url: 'http://streaming.radio.funradio.fr/fun-1-48-192',
        refresh: 3600,

    };
}

module.exports = {
    functions: {service: radioService, defaultOptions: defaultOptions},
};

