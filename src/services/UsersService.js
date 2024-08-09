const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');

const addUser = async ({ name, email, password, confirmPassword, isVerified }) => {
  let hashedPassword;
  let loginCount;
  const existUser = await findUserById(email);

  if (existUser[0]) {
    throw new InvariantError('Fail to add user. Email already exist');
  }

  if (password) {
    if (password != confirmPassword) {
      throw new InvariantError('The passwords entered do not match. Please try again');
    };
    hashedPassword = await bcrypt.hash(password, 10);
    loginCount = 0;
  } else {
    loginCount = 1;
  }

  const id = `user-${nanoid(16)}`;
  const verificationToken = nanoid(16);
  const updatedAt = new Date();


  const query = {
    text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, DEFAULT, $7, $8, DEFAULT, DEFAULT) RETURNING *',
    values: [id, name, email, hashedPassword, verificationToken, isVerified, updatedAt, loginCount],
  };

  const result = await pool.query(query);


  if (!result.rows.length) {
    throw new InvariantError('Failed to add user. Please try again');
  }
  return result.rows[0];
};

const findUserById = async (keyword) => {
  const query = {
    text: 'SELECT * FROM users WHERE id = $1 OR email = $1',
    values: [keyword],
  };

  const result = await pool.query(query);
  return result.rows;
};

const verifyEmailByToken = async ({ token }) => {
  const query = {
    text: 'UPDATE users SET is_verified = true WHERE verification_token = $1 RETURNING id',
    values: [token]
  };
  const { rows } = await pool.query(query);
  if (!rows[0]) {
    throw new InvariantError('Token invalid');
  }
  return 'Verification email success';
};

const verifyUserCredential = async ({ email, password }) => {
  const query = {
    text: 'SELECT id, password FROM users WHERE email = $1 AND is_verified = true',
    values: [email],
  };


  const result = await pool.query(query);

  if (!result.rows.length) {
    throw new AuthenticationError('The credentials you provided are incorrect.');
  }

  const { id, password: hashedPassword } = result.rows[0];

  const match = await bcrypt.compare(password, hashedPassword);

  if (!match) {
    throw new AuthenticationError('The password you entered is incorrect.');
  }
  return id;
};


module.exports = {
  addUser,
  findUserById,
  verifyUserCredential,
  verifyEmailByToken,
};