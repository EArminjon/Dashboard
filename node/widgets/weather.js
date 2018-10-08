var widget = function (json, app) {
    var data = JSON.parse(json);
    var str = data.query.results.channel.item.description;
    var lim = str.search("src=\"") + 5;
    str = str.slice(lim);
    lim = str.search("\"");

    /*console.log(data.query.results.channel);*/
    var url = str.substring(0, lim);
    var title = data.query.results.channel.location.city;
    var temperature = data.query.results.channel.item.condition.temp + "°" + data.query.results.channel.units.temperature;

    global.html;
    app.render(__dirname + '/weather_template.ejs', {
        title: title,
        temperature: temperature,
        url: url,
    }, function (error, htmldata) {
        global.html = htmldata;
    });

    return global.html;
};

function getWeather(app, city) {
    /*var city = "PARIS";*/
    var degree = "c";
    var url = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + city + "') and u='" + degree + "'&format=json";
    var request = require("request");
    var sync_request = require("sync-request");

    var res = sync_request('GET', url);
    var html = widget(res.getBody().toString(), app);
    /*html = html.fromCharCode(13, 10);*/
    return html;
}

module.exports = {
    getWeather: getWeather
};

