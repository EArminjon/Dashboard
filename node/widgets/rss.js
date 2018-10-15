const fs = require('fs');
const fastXmlParser = require('fast-xml-parser');
const ejs = require('ejs');
const XML = require('pixl-xml');


function widget(xml, app, options) {

    var jsonObj = fastXmlParser.parse(xml);
    var xmlArray = XML.parse(xml);
    var data = xmlArray.channel;

    var ejsfile = fs.readFileSync(__dirname + '/rss_template.ejs', 'utf-8');

    return ejs.render(ejsfile, {
        ...options,
        data: data,
    });
}

function rssService(option) {
    var response = {url: null, function: null,};

    if (!(option != null && 'refresh' in option && 'url' in option)) {
        console.log(option);
        console.log("Invalid option rss");
        return response;
    }

    response.url = option.url;
    response.function = widget;
    return response;
}

function defaultOptions(id) {
    return {
        id: id,
        url: 'https://www.lemonde.fr/rss/une.xml',
        limit: 10,
        refresh: 3600,

    };
}

module.exports = {
    functions: {service: rssService, defaultOptions: defaultOptions},
};
