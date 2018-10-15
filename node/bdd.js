
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserDetail = new Schema({
    username: {type: String, unique: true},
    password: String,
    services: [],
});

const UserDetails = mongoose.model('User', UserDetail);

function getServices(username) {
	var assert = require('assert');
	var query = UserDetails.findOne({username: username});
	assert.ok(!(query instanceof Promise));
	return query;
}

module.exports = {
	UserDetails: UserDetails,
	getServices: getServices
}