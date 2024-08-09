const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { nanoid } = require('nanoid');
const { mapDBToModel } = require('../utils');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');

const addUser = async ({ name, email, password, confirmPassword, isVerified, isOauth }) => {
  const existUser = await findUserByKeyword(email);
  const updatedAt = new Date();
  let lastLoginAt;
  let logoutAt;
  let hashedPassword;
  let loginCount;

  if (isOauth) {
    loginCount = 1;
    lastLoginAt = new Date();
    logoutAt = null;
    if (existUser[0]) {
      updateLoginInfo(existUser[0].loginCount, lastLoginAt, updatedAt, email);
      return existUser[0];
    }
  } else {
    if (existUser[0]) {
      throw new InvariantError('Fail to add user. Email already exist');
    }
  }

  if (password) {
    lastLoginAt = null;
    logoutAt = null;
    if (password != confirmPassword) {
      throw new InvariantError('The passwords entered do not match. Please try again');
    };
    hashedPassword = await bcrypt.hash(password, 10);
    loginCount = 0;
  }

  const id = `user-${nanoid(16)}`;
  const verificationToken = nanoid(16);


  const query = {
    text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, DEFAULT, $7, $8, $9, $10, $11) RETURNING *',
    values: [id, name, email, hashedPassword, verificationToken, isVerified, updatedAt, loginCount, lastLoginAt, logoutAt, isOauth],
  };

  const result = await pool.query(query);


  if (!result.rows.length) {
    throw new InvariantError('Failed to add user. Please try again');
  }
  return result.rows[0];
};

const updateLoginInfo = async (oldLoginCount, lastLoginAt, updatedAt, email) => {
  const loginCount = oldLoginCount + 1;
  const query = {
    text: 'UPDATE users SET login_count = $1, last_login_at = $2, updated_at = $3 WHERE email = $4 RETURNING *',
    values: [loginCount, lastLoginAt, updatedAt, email]
  };
  const { rows } = await pool.query(query);
  return rows;
};

const findUserByKeyword = async (keyword) => {
  const query = {
    text: 'SELECT * FROM users WHERE id = $1 OR email = $1',
    values: [keyword],
  };

  const { rows } = await pool.query(query);
  return rows.map(mapDBToModel);
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

const editNameById = async ({ id, name }) => {
  const query = {
    text: 'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, email, name',
    values: [name, id]
  };
  const { rows } = await pool.query(query);
  if (!rows[0]) {
    throw new InvariantError('Fail to update name. id invalid');
  }
  return rows[0];
};

const editPasswordById = async ({ oldPassword, newPassword, confirmPassword, id }) => {

  const result = await findUserByKeyword(id);
  console.log('result', result[0]);
  const match = await bcrypt.compare(oldPassword, result[0].password);
  if (!match) {
    throw new AuthenticationError('The old password you entered is incorrect.');
  }
  if (newPassword !== confirmPassword) {
    throw new InvariantError('The passwords entered do not match. Please try again');
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const query = {
    text: 'UPDATE users SET password = $1 WHERE id = $2 RETURNING id',
    values: [hashedPassword, id]
  };
  const { rows } = await pool.query(query);
  if (!rows[0]) {
    throw new InvariantError('Fail to update name. id invalid');
  }
  return rows[0];
};

const findUsers = async () => {
  const { rows } = await pool.query('SELECT email, created_at, login_count, logout_at FROM users');
  return rows.map(mapDBToModel);
};

const findUsersStatistics = async () => {
  const resTotalSignedUp = await pool.query('SELECT COUNT(*) AS total_sign_up FROM users');
  const resTotalActiveToday = await pool.query('SELECT COUNT(*) AS total_active_today FROM users WHERE DATE(last_login_at) = CURRENT_DATE');
  const resAvgActive7Days = await pool.query(`
    SELECT AVG(active_day_count) AS avg_count FROM (
    SELECT COUNT(*) AS active_day_count
    FROM users
    WHERE last_login_at >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY DATE(last_login_at)
) AS subquery`);
  const result = {
    totalSignUp: resTotalSignedUp.rows[0].total_sign_up,
    totalActiveToday: resTotalActiveToday.rows[0].total_active_today,
    avgActiveDays: resAvgActive7Days.rows[0].avg_count
  };

  return result;
};

const editToken = async ({ email }) => {
  const token = nanoid(16);
  const query = {
    text: 'UPDATE users SET verification_token = $1 WHERE email = $2 RETURNING id, is_verified, verification_token',
    values: [token, email]
  };
  const { rows } = await pool.query(query);
  const result = rows.map(mapDBToModel);
  if (!result[0]) {
    throw new InvariantError('Email invalid');
  }
  if (result[0].isVerified) {
    throw new InvariantError('Email already verified');
  }
  return result[0];
};


module.exports = {
  addUser,
  findUserByKeyword,
  verifyUserCredential,
  verifyEmailByToken,
  editNameById,
  editPasswordById,
  findUsers,
  findUsersStatistics,
  editToken
};