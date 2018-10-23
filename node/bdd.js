const assert = require('assert');
const mongoose = require('mongoose');

const url = "mongodb://robzzledieu:azerty123456@ds125423.mlab.com:25423/dashboard";
mongoose.connect(url,
    {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }, (err) => {
        if (err) {
            console.log("Fail on connect db");
        } else {
            console.log("Connected to db");
        }
    });

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
        if (result != null && 'services' in result)
            for (let i = 0; result.services[i]; ++i) {
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
        if (result != null && 'services' in result)
            for (let i = 0; result.services[i]; ++i) {
                if (result.services[i].options.id === widget.options.id) {
                    delete result.services[i];
                    result.services = result.services.filter(Boolean);
                    UserDetails.findOneAndUpdate({_id: result._id}, {services: result.services}).then(function (result) {
                        /*                    console.log(result);*/
                    });
                }
            }
    });
}

function addWidget(username, widget) {
    getServices(username).then(function (result) {
        let find = false;
        let i = 0;
        if (result != null && 'services' in result)
            for (; result.services[i]; ++i) {
                if (result.services[i].options.id === widget.options.id) {
                    result.services[i] = widget;
                    find = true;
                }
            }
        if (find === false)
            result.services[i] = widget;
        UserDetails.findOneAndUpdate({_id: result._id}, {services: result.services}).then(function (result) {
            /*console.log(result);*/
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