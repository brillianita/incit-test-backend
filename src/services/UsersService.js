const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');

const addUser = async ({ email, password, confirmPassword }) => {
  await verifyNewEmail(email);

  const id = `user-${nanoid(16)}`;
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid(16);
  const updatedAt = new Date();

  if (password != confirmPassword) {
    throw new InvariantError('The passwords entered do not match. Please try again');
  };

  const query = {
    text: 'INSERT INTO users VALUES($1, DEFAULT, $2, $3, $4, DEFAULT, DEFAULT, $5, DEFAULT, DEFAULT, DEFAULT) RETURNING id',
    values: [id, email, hashedPassword, verificationToken, updatedAt],
  };

  const result = await pool.query(query);

  if (!result.rows.length) {
    throw new InvariantError('Failed to add user. Please try again');
  }
  return result.rows[0].id;
};

const verifyNewEmail = async (email) => {
  const query = {
    text: 'SELECT email FROM users WHERE email = $1',
    values: [email],
  };

  const result = await pool.query(query);

  if (result.rows.length > 0) {
    throw new InvariantError('Failed to add user. Username is already in use.');
  }
};

const verifyUserCredential = async (email, password) => {
  const query = {
    text: 'SELECT id, password FROM users WHERE email = $1',
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
  verifyNewEmail,
  verifyUserCredential
};