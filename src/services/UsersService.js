const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthenticationError = require('../exceptions/AuthenticationError');

const addUser = async ({ name, email, password, confirmPassword, isVerified }) => {
  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
    if (password != confirmPassword) {
      throw new InvariantError('The passwords entered do not match. Please try again');
    };
  }
  await verifyNewEmail(email);

  const id = `user-${nanoid(16)}`;
  const verificationToken = nanoid(16);
  const updatedAt = new Date();


  const query = {
    text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, DEFAULT, $7, DEFAULT, DEFAULT, DEFAULT) RETURNING *',
    values: [id, name, email, hashedPassword, verificationToken, isVerified, updatedAt],
  };

  const result = await pool.query(query);


  if (!result.rows.length) {
    throw new InvariantError('Failed to add user. Please try again');
  }
  return result.rows[0];
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

const findUserById = async (id) => {
  const query = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [id],
  };

  const result = await pool.query(query);

  if (result.rows.length === 0) {
    throw new NotFoundError('Not found');
  }
  console.log('hasil findbyid', result.rows);
  return result.rows;
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
  verifyNewEmail,
  verifyUserCredential
};