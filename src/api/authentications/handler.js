const { generateToken } = require('../../tokenize/tokenManager');
const ClientError = require('../../exceptions/ClientError');
const { sendVerificationEmail } = require('../../services/emailService');
const { verifyUserCredential, editLogoutInfo, editLoginInfo } = require('../../services/UsersService');
const { nanoid } = require('nanoid');
const AuthenticationError = require('../../exceptions/AuthenticationError');

const postAuthenticationByEmail = async (req, res) => {
  try {
    const tokenVerify = nanoid(16);
    const { email, password } = req.body;

    const { id, isVerified } = await verifyUserCredential({ email, password });

    if (!isVerified) {
      sendVerificationEmail(email, tokenVerify);
      throw new AuthenticationError('Please verify your email first');
    }
    let token = generateToken({ id });

    const cookie = req.cookies;
    if (cookie.token) {
      const oldToken = cookie.token;
      token = oldToken;
    } else {
      token = generateToken({ id });
      await editLoginInfo({ id });
    }
    res.cookie('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });
    res.cookie('id', id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });

    const response = res.status(201).json({
      status: 'success',
      data: {
        id,
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
    const { id } = req.user;
    let token = generateToken({ id });

    const cookie = req.cookies;
    if (cookie.token) {
      const oldToken = cookie.token;
      token = oldToken;
    } else {
      token = generateToken({ id });
      await editLoginInfo({ id });
    }
    res.cookie('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });
    res.cookie('id', id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });

    res.redirect('http://localhost:5173/dashboard');
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
    let token = generateToken({ id });
    const cookie = req.cookies;

    if (cookie.token) {
      const oldToken = cookie.token;
      token = oldToken;
    } else {
      token = generateToken({ id });
      await editLoginInfo({ id });
    }
    res.cookie('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });
    res.cookie('id', id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });

    res.redirect('http://localhost:5173/dashboard');
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
    const { id } = req.params;
    await editLogoutInfo({ id });
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    res.clearCookie('id', {
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
    const response = res.status(200).json({
      status: 'success',
      message: 'logout successfully'
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


module.exports = {
  postAuthenticationByEmail,
  postAuthenticationByGoogle,
  postAuthenticationByFacebook,
  deleteAuthentication,
  profile
};