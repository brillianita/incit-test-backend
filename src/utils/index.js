/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  name,
  email,
  password,
  verification_token,
  is_verified,
  created_at,
  updated_at,
  login_count,
  last_login_at,
  logout_at,
  is_oauth,
}) => ({
  id,
  name,
  email,
  password,
  verification_Token: verification_token,
  isVerified: is_verified,
  createdAt: created_at,
  updatedAt: updated_at,
  loginCount: login_count,
  lastLoginAt: last_login_at,
  logoutAt: logout_at,
  isOauth: is_oauth
});

module.exports = { mapDBToModel };