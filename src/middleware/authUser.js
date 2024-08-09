const jwt = require('jsonwebtoken');
const AuthorizationError = require('../exceptions/AuthorizationError');
const AuthenticationError = require('../exceptions/AuthenticationError');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new AuthenticationError('No Token Provided');
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) throw new AuthorizationError('Invalid Token');
    req.user = user;
    next();
  });
};


module.exports = {
  verifyToken,
};
