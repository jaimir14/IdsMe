var winston = require('winston');
var nconf = require('nconf');

winston.add(winston.transports.File, {
	"filename": "error_log",
	"level": nconf.get("logger:fileLevel")
});