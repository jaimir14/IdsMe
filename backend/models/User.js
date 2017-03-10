const mongoose = require('mongoose');
const logger = require('winston');
const bcrypt = require('bcryptjs');
const nconf = require('nconf');

mongoose.Promise = global.Promise;
const SALT_WORK_FACTOR = nconf.get('secret:salt');

const userSchema = mongoose.Schema({
	name: String,
	userName: {
		type: String,
		unique: true,
		required: true,
		dropDups: true
	},
	password: {
		type: String,
		select: false
	},
	email: {
		type: String,
		unique: true,
		required: true,
		dropDups: true
	},
	phones: [Number]
});

const errorHandling = (error, doc, next) => {
	logger.error(error);
	if (error.name === 'MongoError' && error.code === 11000) {
		next(new Error('There was a duplicate key error'), doc);
	} else {
		next(error, doc);
	}
};

userSchema.post('save', errorHandling);
userSchema.post('update', errorHandling);
userSchema.pre('save', function(next) {
	let user = this;

	if (!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		// hash the password along with our new salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword) {
	return new Promise((resolve, reject) => {
		bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
			if (err) {
				logger.err(err);
			}
			resolve(isMatch);
		})
	});
};

const User = mongoose.model('User', userSchema);