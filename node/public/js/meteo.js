var city = "PARIS";
var degree = "c";


var callbackFunction = function (data) {
    console.log(data);
    if ($("#widget_weather")) {
        $('[data-weather="title"]').text(city);
        $('[data-weather="temp-now"]').text(data.query.results.channel.item.condition.temp + "°" + data.query.results.channel.units.temperature);
        var url = data.query.results.channel.item.description;
        var lim = url.search("src=\"") + 5;
        url = url.slice(lim);
        lim = url.search("\"");
        url = url.substring(0, lim);
        $('[data-weather="image"] img').attr("src", url);
        $("#widget_weather").removeClass('invisible');

    }
};

(function (documents, script) {
    script = documents.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\'" + city + "\') and u='" + degree + "'&format=json&callback=callbackFunction";
    documents.getElementsByTagName('head')[0].appendChild(script);
}(document));