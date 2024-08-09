const tokenManager = require('../../tokenize/tokenManager');
const { verifyUserCredential } = require('../../services/usersService');

const postAuthentication = async (req, res) => {

  const { email, password } = req.body;
  const id = await verifyUserCredential({ email, password });
  const token = tokenManager.generateAccessToken({ id });

  res.cookie('token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
  });

  const response = res.status(201).json({
    status: 'success',
    data: {
      token
    }
  });
  return response;
};


module.exports = {
  postAuthentication,
};