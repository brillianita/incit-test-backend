const tokenManager = require('../../tokenize/tokenManager');
const { verifyUserCredential } = require('../../services/usersService');

const postAuthenticationByEmail = async (req, res) => {
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

const postAuthenticationByGoogle = async (req, res) => {
  res.redirect('/profile');
};

const profile = async (req, res) => {
  res.send('Success');
};

const deleteAuthentication = async (req, res) => {
  req.logout();
  res.clearCookie('connect.sid');
  res.redirect('/');
};


module.exports = {
  postAuthenticationByEmail,
  postAuthenticationByGoogle,
  deleteAuthentication,
  profile
};