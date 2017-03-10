const logger = require('winston');
const jwt = require('jsonwebtoken');
var nconf = require('nconf');

function isAuthenticated(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, nconf.get('secret:key'), (err, decoded) => {
      if (err) {
        logger.error(err);
        return res.status(403).json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
};

module.exports = isAuthenticated;