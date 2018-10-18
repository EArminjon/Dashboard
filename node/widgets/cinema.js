const fs = require('fs');
const ejs = require('ejs');

var widget = function (json, app, options) {
    let data = JSON.parse(json);
    let error = false;

    let movies = data.Search;
    if (typeof(data.error) !== "undefined" || data.Response === 'False')
        error = true;

    var ejsfile = fs.readFileSync(__dirname + '/cinema_template.ejs', 'utf-8');
    return ejs.render(ejsfile, {
        ...options,
        error: error,
        movies: movies,
    });
};

function cinemaService(options) {
    var response = {url: null, function: null, header: null};

    let title = encodeURI(options.movie);
    response.url = `http://www.omdbapi.com/?apikey=238ec89e&s=${title}`;
    response.function = widget;
    return response;
}

function defaultOptions(id) {
    return {
        id: id,
        title: 'Cinema',
        movie: 'Star Wars',
        refresh: 3600,

    };
}

module.exports = {
    functions: {service: cinemaService, defaultOptions: defaultOptions},
};

