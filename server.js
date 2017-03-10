const express = require('express');
const enrouten = require('express-enrouten');
const nconf = require('nconf');
const winston = require('winston');
const expressWinston = require('express-winston');
const bodyParser = require('body-parser');
const cors = require('cors');

require('./lib/scripts');

winston.info('HTTP Config: ', nconf.get('http'));
const app = express();
app.use(cors());

app.set('port', process.env.PORT || nconf.get('http:port'));

require('./models');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}));

// parse application/json
app.use(bodyParser.json());

app.use(expressWinston.logger({
	transports: [
		new winston.transports.Console({
			json: false,
			colorize: true
		})
	],
	meta: false, // optional: control whether you want to log the meta data about the request (default to true) 
	expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true 
	colorize: true
}));
app.use(enrouten({
	directory: 'controllers'
}));
const server = app.listen(app.get('port'), (err) => {
	if (err) {
		return winston.error(err);
	}

	winston.info('Listening at http://localhost:' + app.get('port') + '/');
});

const io = require('socket.io')(server);
io.on('connection', (socket) => {
	winston.info('a user connected');

	socket.on('disconnect', () => {
		winston.info('user disconnected');
	});
});