const { validateUser } = require('../../validators/user');
const { addUser } = require('../../services/UsersService');
const { sendVerificationEmail } = require('../../services/emailService');
const InvariantError = require('../../exceptions/InvariantError');
const ClientError = require('../../exceptions/ClientError');

const postUserHandler = async (req, res) => {
  try {
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
  } catch (e) {
    if (e instanceof ClientError) {
      return res.status(e.statusCode).send({
        status: 'fail',
        message: e.message,
      });
    }
    return res.status(500).send({
      status: 'fail',
      message: e,
    });
  }
};


module.exports = { postUserHandler };
