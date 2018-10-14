const fs = require('fs');
const ejs = require('ejs');

var widget = function (xml, app, options) {

    var DomParser = require('dom-parser');
    var parser = new DomParser();

    fs.readFile(xml, 'utf8', function(err, html){
        if (!err){
            var dom = parser.parseFromString(html);

            /*console.log(dom.getElementById('myElement').innerHTML);*/
        } /*else
            console.log(err);*/
    });


    var ejsfile = fs.readFileSync(__dirname + '/rss_template.ejs', 'utf-8');

    return ejs.render(ejsfile, {
        ...options,
    });
};

function rssService(option) {
    var response = {url: null, function: null,};

    if (!(option != null && 'refresh')) {
        console.log(option);
        console.log("Invalid option");
        return response;
    }

    response.url = `https://www.lemonde.fr/rss/une.xml`;
    response.function = widget;
    return response;
}

module.exports = {
    rssService: rssService,
};

