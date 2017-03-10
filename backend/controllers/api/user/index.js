const User = require('mongoose').model('User');
const logger = require('winston');
const auth = require('../../../lib/validateUser.js');

module.exports = (router) => {
	router.get('/', auth, (req, res) => {
		User.find({}).then((users) => {
			res.status(200).send(users);

		}).catch((err) => {
			logger.error(err);
			res.status(400).send('Please try it later');
		});
	});

	router.post('/', (req, res) => {
		let user = new User(req.body);
		if (req.body._id) {
			res.status(400).send('Maybe you are trying to do a PUT instead of POST');
			return;
		}
		user.save().then(() => {
			res.status(201).send('user saved');
		}).catch((err) => {
			res.status(400).send('user not saved');
		});

	});
	router.get('/:id', auth, (req, res) => {
		User.findById(req.params.id).then((user) => {
			res.status(200).send(user);
		}).catch((err) => {
			logger.error(err);
			res.status(400).send('User not found');
		});
	})
	router.put('/', auth, (req, res) => {
		let user = new User(req.body);
		User.findById(user._id).then((oldUser) => {
			return oldUser.update(user);
		}).then(() => {
			res.status(200).send('user updated')
		}).catch((err) => {
			res.status(400).send('user not updated');
		})
	});
};