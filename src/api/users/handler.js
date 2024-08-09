const { validateUser } = require('../../validators/user');
const { addUser } = require('../../services/usersService');
const { sendVerificationEmail } = require('../../services/emailService');
const InvariantError = require('../../exceptions/InvariantError');

const postUserHandler = async (req, res) => {

  const { email, password, confirmPassword } = req.body;
  const validationResult = validateUser({ email, password });
  if (!validationResult.isValid) {
    throw new InvariantError(`Validation error: ${validationResult.message}`);
  }

  const userId = await addUser({ email, password, confirmPassword });
  console.log(userId);
  await sendVerificationEmail(email, userId.verification_token);

  const response = res.status(201).json({
    status: 'success',
    data: {
      userId
    }
  });
  return response;
};


module.exports = { postUserHandler };
