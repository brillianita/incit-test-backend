const { validateUser } = require('../../validators/user');
const { addUser, verifyEmailByToken, editNameById, editPasswordById } = require('../../services/usersService');
const { sendVerificationEmail } = require('../../services/emailService');
const InvariantError = require('../../exceptions/InvariantError');

const postUserHandler = async (req, res) => {

  const { email, password, confirmPassword } = req.body;
  const validationResult = validateUser({ email, password });
  if (!validationResult.isValid) {
    throw new InvariantError(`Validation error: ${validationResult.message}`);
  }

  const userId = await addUser({ name: null, email, password, confirmPassword, isVerified: false });
  await sendVerificationEmail(email, userId.verification_token);

  const response = res.status(201).json({
    status: 'success',
    data: {
      userId
    }
  });
  return response;
};

const putVerifyEmail = async (req, res) => {
  const { token } = req.query;
  const result = await verifyEmailByToken({ token });

  const response = res.status(201).json({
    status: 'success',
    message: result
  });
  return response;
};

const putNameById = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const result = await editNameById({ name, id });

  const response = res.status(201).json({
    status: 'success',
    message: result
  });
  return response;
};

const putPasswordById = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const { id } = req.params;
  const result = await editPasswordById({ oldPassword, newPassword, confirmPassword, id });

  const response = res.status(201).json({
    status: 'success',
    message: result
  });
  return response;
};


module.exports = {
  postUserHandler,
  putVerifyEmail,
  putNameById,
  putPasswordById
};
