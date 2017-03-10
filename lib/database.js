var mongoose = require('mongoose');
var winston = require('winston');
var nconf = require('nconf');

mongoose.connect(nconf.get("database:host"));
var db = mongoose.connection;

db.on('error', winston.error.bind(winston, 'Database error!'));
db.once('open', function callback() {
	winston.info('db connection open');
});