const { validateUser } = require('../../validators/user');
const { addUser, verifyEmailByToken, editNameById, editPasswordById, findUsers, findUsersStatistics, editToken, findUserByKeyword } = require('../../services/UsersService');
const { sendVerificationEmail } = require('../../services/emailService');
const InvariantError = require('../../exceptions/InvariantError');
const ClientError = require('../../exceptions/ClientError');

const postUserHandler = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const validationResult = validateUser({ password });
    if (!validationResult.isValid) {
      throw new InvariantError(`Validation error: ${validationResult.message}`);
    }

    const result = await addUser({ name: null, email, password, confirmPassword, isVerified: false, isOauth: false });
    await sendVerificationEmail(email, result.verification_token);

    const response = res.status(201).json({
      status: 'success',
      data: {
        result
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

const putVerifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    await verifyEmailByToken({ token });

    res.redirect('http://localhost:5173/login');
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

const putNameById = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const result = await editNameById({ name, id });

    const response = res.status(201).json({
      status: 'success',
      message: result
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

const putPasswordById = async (req, res) => {
  try {
    const { oldPassword, password, confirmPassword } = req.body;
    const { id } = req.params;
    const validationResult = validateUser({ password });
    if (!validationResult.isValid) {
      throw new InvariantError(`Validation error: ${validationResult.message}`);
    }

    const result = await editPasswordById({ oldPassword, password, confirmPassword, id });

    const response = res.status(201).json({
      status: 'success',
      message: result
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

const getUsers = async (req, res) => {
  try {
    const result = await findUsers();
    const response = res.status(201).json({
      status: 'success',
      data: result
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

const getUsersStatistics = async (req, res) => {
  try {
    const result = await findUsersStatistics();
    const response = res.status(201).json({
      status: 'success',
      data: result
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

const resendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await editToken({ email });
    await sendVerificationEmail(email, result.verificationToken);
    const response = res.status(200).json({
      status: 'success',
      message: ' verication email was sent'
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

const getUsersById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await findUserByKeyword(id);

    if (!result) {
      throw new InvariantError('User not found');
    }
    const response = res.status(200).json({
      status: 'success',
      data: result
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
  postUserHandler,
  putVerifyEmail,
  putNameById,
  putPasswordById,
  getUsers,
  getUsersStatistics,
  resendEmailVerification,
  getUsersById
};
