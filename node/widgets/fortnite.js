const fs = require('fs');
const ejs = require('ejs');

var widget = function (json, app, options) {
    let data = JSON.parse(json);
    let error = false;
    let stats = [];
    let plateforme = 'pc';
    let user = '';
    if (typeof(data.error) !== "undefined")
        error = true;
    else {
        for (let item in data.lifeTimeStats) {
            stats[data.lifeTimeStats[item].key] = data.lifeTimeStats[item].value;
        }
        plateforme = data.platformName;
        user = data.epicUserHandle;
    }

    var ejsfile = fs.readFileSync(__dirname + '/fortnite_template.ejs', 'utf-8');
    return ejs.render(ejsfile, {
        ...options,
        plateforme: plateforme,
        user: user,
        error: error,
        data: stats,
    });
};

function fortniteService(options) {
    var response = {url: 'https://api.fortnitetracker.com/v1/profile', function: null, header: null};

    response.header = {
        'TRN-Api-Key': '2bf71bbd-2bac-49b8-a1da-b8af2d4a0a50',
    };
    response.url += `/${options.plateforme}/${options.pseudo}`;
    response.function = widget;
    return response;
}

function defaultOptions(id) {
    return {
        id: id,
        title: 'Fortnite',
        plateforme: 'xbox',
        pseudo: 'RelaxasFr',
        refresh: 3600,

    };
}

module.exports = {
    functions: {service: fortniteService, defaultOptions: defaultOptions},
};

