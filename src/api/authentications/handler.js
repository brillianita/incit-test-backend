const tokenManager = require('../../tokenize/tokenManager');
const { verifyUserCredential } = require('../../services/usersService');
const ClientError = require('../../exceptions/ClientError');

const postAuthenticationByEmail = async (req, res) => {
  try {
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
  } catch (e) {
    if (e instanceof ClientError) {
      return res.status(e.statusCode).send({
        status: 'fail',
        message: e.message,
      });
    }
    return res.status(500).send({
      status: 'fail',
      message: 'Sorry there was a failure on our server.',
    });
  }
};

const postAuthenticationByGoogle = async (req, res) => {
  try {
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
  } catch (e) {
    if (e instanceof ClientError) {
      return res.status(e.statusCode).send({
        status: 'fail',
        message: e.message,
      });
    }
    return res.status(500).send({
      status: 'fail',
      message: 'Sorry there was a failure on our server.',
    });
  }
};

const postAuthenticationByFacebook = async (req, res) => {
  try {

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
  } catch (e) {
    if (e instanceof ClientError) {
      return res.status(e.statusCode).send({
        status: 'fail',
        message: e.message,
      });
    }
    return res.status(500).send({
      status: 'fail',
      message: 'Sorry there was a failure on our server.',
    });
  }
};

const profile = async (req, res) => {
  res.send('Success');
};

const deleteAuthentication = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.log('Error destroying session:', err);
        }
      });
    }

    // Redirect user to the homepage or login page
    res.redirect('/');
  } catch (e) {
    if (e instanceof ClientError) {
      return res.status(e.statusCode).send({
        status: 'fail',
        message: e.message,
      });
    }
    return res.status(500).send({
      status: 'fail',
      message: 'Sorry there was a failure on our server.',
    });
  }
};


module.exports = {
  postAuthenticationByEmail,
  postAuthenticationByGoogle,
  postAuthenticationByFacebook,
  deleteAuthentication,
  profile
};