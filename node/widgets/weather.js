var todayWidget = function (json, app, option) {
    var data = JSON.parse(json);
    if (data.query.results == null)
        return '';
    var str = data.query.results.channel.item.description;
    var lim = str.search("src=\"") + 5;
    str = str.slice(lim);
    lim = str.search("\"");

    /*console.log(data.query.results.channel);*/
    var url = str.substring(0, lim);
    var title = data.query.results.channel.location.city;
    var temperature = data.query.results.channel.item.condition.temp + "°" + data.query.results.channel.units.temperature;

    global.html = null;
    app.render(__dirname + '/weather_template.ejs', {
        id: option.id,
        title: title,
        temperature: temperature,
        url: url,
    }, function (error, htmldata) {
        global.html = htmldata;
    });

    return global.html;
};

function weatherService(widget, option) {
    var response = {url: null, function: null,};

    if (!(option != null && 'city' in option && 'degree' in option))
        return response;

    response.url = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + option.city + "') and u='" + option.degree + "'&format=json";
    switch (widget) {
        case 'today':
            response.function = todayWidget;
            break;
        default:
            break;
    }
    return response;
}

module.exports = {
    weatherService: weatherService,
};

