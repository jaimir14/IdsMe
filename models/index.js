var models = [
	'User',
	'PhoneId'
];

models.forEach(function(model) {
	require(__dirname + '/' + model);
	console.log("Loading model: " + model);
});

console.log("models loaded");