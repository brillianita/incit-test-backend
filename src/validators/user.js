const Joi = require('joi');

const userPayloadSchema = Joi.object({
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
      'string.empty': 'Password cannot be empty.',
      'any.required': 'Password is required.'
    }),
});

const validateUser = (user) => {
  const { error } = userPayloadSchema.validate(user);
  if (error) {
    return { isValid: false, message: error.details[0].message };
  }
  return { isValid: true, message: 'Validation successful' };
};

module.exports = { validateUser };