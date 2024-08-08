// const { validateUser } = require('../../validators/user');
const { addUser } = require('../../services/UsersService');
// const InvariantError = require('../../exceptions/InvariantError');

const postUserHandler = async (req, res) => {
  // const validationResult = validateUser(req.body);

  // if (!validationResult.isValid) {
  //   throw new InvariantError('Validation error:', validationResult.message);
  // }
  const { email, password, confirmPassword } = req.body;

  const userId = await addUser({ email, password, confirmPassword });

  const response = res.status(201).json({
    status: 'success',
    data: {
      userId
    }
  });
  return response;
};


module.exports = { postUserHandler };
