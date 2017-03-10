const PhoneId = require('mongoose').model('PhoneId');
const logger = require('winston');
const auth = require('../../../lib/validateUser.js');

module.exports = (router) => {

	router.get('/', auth, (req, res) => {
		PhoneId.find({}).then((phoneIds) => {
			res.status(200).send(phoneIds);

		}).catch((err) => {
			logger.error(err);
			res.status(400).send('Please try again later');
		});
	}).post('/', auth, (req, res) => {
		let phoneId = new PhoneId(req.body);
		if (req.body._id) {
			res.status(400).send('Maybe you are trying to do a PUT instead of POST');
			return;
		}
		phoneId.save().then(() => {
			res.status(201).send('phoneId saved');
		}).catch((err) => {
			logger.error(err);
			res.status(400).send('phoneId not saved');
		});

	}).put('/:id', auth, (req, res) => {
		let phoneId = new PhoneId(req.body);
		PhoneId.findById(req.params.id).then((oldPhoneId) => {
			return oldPhoneId.update(phoneId);
		}).then(() => {
			res.status(200).send('PhoneId updated');
		}).catch((err) => {
			logger.error(err);
			res.status(400).send('Please try again later');
		});
	}).get('/:id', auth, (req, res) => {
		PhoneId.findById(req.params.id).then((phoneId) => {
			res.status(200).send(phoneId);
		}).catch((err) => {
			logger.error(err);
			res.status(400).send('PhoneId not found');
		});
	}).delete('/:id', auth, (req, res) => {
		PhoneId.findById(req.params.id).then((phoneId) => {
			return phoneId.remove();
		}).then((removed) => {
			res.status(200).send('PhoneId deleted')
		}).catch((err) => {
			res.status(400).send('Please try again later');
		});
	});
};