const mongoose = require('mongoose');

const phoneIdSchema = mongoose.Schema({
	name: String,
	verified: {
		type: Number,
		default: 0
	},
	phones: [String],
	description: String,
	country: String,
	owner: String

});

const PhoneId = mongoose.model('PhoneId', phoneIdSchema);