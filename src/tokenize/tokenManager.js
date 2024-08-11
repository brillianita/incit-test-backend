const jwt = require('jsonwebtoken');

const generateToken = ({ id }) => {
  return jwt.sign({ id }, process.env.SECRET);
};

const verifyToken = (req, res, next) => {
  const cookie = req.headers.cookie;

  if (!cookie) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }
  const token = cookie.split('; ').find((row) => row.startsWith('token=')).split('=')[1];

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: err.message,
      });
    }
    req.user = decoded;
    console.log('req.user', req.user);
    next();
  });
};

module.exports = { generateToken, verifyToken };
