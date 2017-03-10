const User = require('mongoose').model('User');
const logger = require('winston');
const jwt = require('jsonwebtoken');
const nconf = require('nconf');

//validateUser
module.exports = (router) => {
	router.post('/validateUser', (req, res) => {
		User.findOne({
			userName: req.body.userName
		}).select('+password').exec().then((user) => {
			return user.comparePassword(req.body.password)
		}).then((isMatch) => {
			if (!isMatch)
				throw new Error('Wrong Password');
			else {
				return User.findOne({
					userName: req.body.userName
				}).exec();
			}
		}).then((userToToken) => {
			let token = jwt.sign(userToToken._doc, nconf.get('secret:key'), {
				expiresIn: '1 day' // expires in 24 hours
			});
			logger.info('token', token);
			res.status(200).json({
				token: token,
				user: userToToken
			});
		}).catch((err) => {
			logger.error(err);
			res.status(400).json('User or Password incorrect');
		});

	});

	router.get('/validateUser', (req, res) => {
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		try {

			// decode 
			jwt.verify(token, nconf.get('secret:key'), (err, decode) => {
				//logger.log('decode', decode.payload);
				try {
					if (err) {
						if (err) throw err;
					} else {
						res.status(200).json({
							user: decode,
							token: token
						});
					}
				} catch (err) {
					logger.error(err);
					res.status(400).send('Token was not decoded');
				}
			});
		} catch (err) {
			logger.error(err);
			res.status(400).send('Token was not decoded');
		}
	});
}