const fs = require('fs');
const ejs = require('ejs');

var widget = function (json, app, option) {
    var data = JSON.parse(json);
    if (data.query.results == null) {
        console.log("query result null");
        return '';
    }
    var str = data.query.results.channel.item.description;
    var lim = str.search("src=\"") + 5;
    str = str.slice(lim);
    lim = str.search("\"");

    var url = str.substring(0, lim);
    var city = data.query.results.channel.location.city;
    var temperature = data.query.results.channel.item.condition.temp + "°" + data.query.results.channel.units.temperature;
    var week = data.query.results.channel.item.forecast;

    var ejsfile = fs.readFileSync(__dirname + '/weather_template.ejs', 'utf-8');

    return ejs.render(ejsfile, {
        id: option.id,
        nbDays: option.nbDays,
        degree: option.degree,
        week: week,
        city: city,
        temperature: temperature,
        url: url,
    });
};

function weatherService(option) {
    var response = {url: null, function: null,};

    if (!(option != null && 'city' in option && 'degree' in option))
        return response;

    response.url = `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='${option.city}') and u='${option.degree}'&format=json`;
    response.function = widget;
    return response;
}

module.exports = {
    weatherService: weatherService,
};

