const tokenManager = require('../../tokenize/tokenManager');
const { verifyUserCredential } = require('../../services/usersService');

const postAuthenticationByEmail = async (req, res) => {
  const { email, password } = req.body;
  const id = await verifyUserCredential({ email, password });
  let token;
  const cookie = req.headers.cookie;
  const oldToken = cookie.split('; ').find((row) => row.startsWith('token=')).split('=')[1];
  if (oldToken) {
    token = oldToken;
  } else {
    token = tokenManager.generateAccessToken({ id });
  }
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
  const { id } = req;
  let token;
  const cookie = req.headers.cookie;
  const oldToken = cookie.split('; ').find((row) => row.startsWith('token=')).split('=')[1];
  if (oldToken) {
    token = oldToken;
  } else {
    token = tokenManager.generateAccessToken({ id });
  }
  res.cookie('token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
  });

  res.redirect('/profile');
};

const postAuthenticationByFacebook = async (req, res) => {
  const { id } = req.user;
  let token;
  const cookie = req.headers.cookie;
  const oldToken = cookie.split('; ').find((row) => row.startsWith('token=')).split('=')[1];
  if (oldToken) {
    token = oldToken;
  } else {
    token = tokenManager.generateAccessToken({ id });
  }
  res.cookie('token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
  });

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
  postAuthenticationByFacebook,
  deleteAuthentication,
  profile
};