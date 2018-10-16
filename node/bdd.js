const mongoose = require('mongoose');
const assert = require('assert');

const Schema = mongoose.Schema;

const UserDetail = new Schema({
    username: {type: String, unique: true},
    password: String,
    services: [],
});

const UserDetails = mongoose.model('User', UserDetail);

function getServices(username) {
    const query = UserDetails.findOne({username: username});
    assert.ok(!(query instanceof Promise));
    return query;
}

function changeWidget(username, widget) {
    getServices(username).then(function (result) {
        for (var i = 0; result.services[i]; ++i) {
            if (result.services[i].options.id === widget.options.id) {
                result.services[i] = widget;
                UserDetails.findOneAndUpdate({_id: result._id}, {services: result.services}).then(function (result) {
                    /*console.log(result);*/
                });
            }
        }
    });
}

function removeWidget(username, widget) {
    getServices(username).then(function (result) {
        for (var i = 0; result.services[i]; ++i) {
            if (result.services[i].options.id === widget.options.id) {
                delete result.services[i];
                UserDetails.findOneAndUpdate({_id: result._id}, {services: result.services}).then(function (result) {
/*                    console.log(result);*/
                });
            }
        }
    });
}

function addWidget(username, widget) {
    getServices(username).then(function (result) {
        var find = false;
        var i = 0;
        for (;result.services[i]; ++i) {
            if (result.services[i].options.id === widget.options.id) {
                result.services[i] = widget;
                find = true;
            }
        }
        if (find === false)
            result.services[i] = widget;
        UserDetails.findOneAndUpdate({_id: result._id}, {services: result.services}).then(function (result) {
            console.log(result);
        });
    });
}

module.exports = {
    UserDetails: UserDetails,
    getServices: getServices,
    changeWidget: changeWidget,
    removeWidget: removeWidget,
    addWidget: addWidget,
};