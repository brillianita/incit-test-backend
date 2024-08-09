const jwt = require('jsonwebtoken');

const TokenManager = {
  generateAccessToken: (id) => jwt.sign(id, process.env.SECRET),
};

module.exports = TokenManager;
