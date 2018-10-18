module.exports.servicesManager = function () {
    return {
        'weather': require("./widgets/weather.js").functions,
        'rss': require("./widgets/rss.js").functions,
        'radio': require("./widgets/radio.js").functions,
        'fortnite': require("./widgets/fortnite.js").functions,
        'time': require("./widgets/time.js").functions,
        'cinema': require("./widgets/cinema.js").functions,
    };
};