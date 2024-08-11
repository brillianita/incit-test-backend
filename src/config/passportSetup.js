// eslint-disable-next-line no-unused-vars
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { addUser, findUserByKeyword } = require('../services/UsersService');
require('dotenv').config();
module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3300/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json;
    const user = await addUser({ name, email, password: null, confirmPassword: null, isVerified: true, isOauth: true });
    done(null, user);
  }));
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:3300/auth/facebook/callback',
    profileURL: 'https://graph.facebook.com/v2.10/me',
    profileFields: ['id', 'email', 'name']
  },
  async (accessToken, refreshToken, profile, done) => {
    // eslint-disable-next-line camelcase
    const { first_name, email } = profile._json;
    // eslint-disable-next-line camelcase
    const user = await addUser({ name: first_name, email, password: null, confirmPassword: null, isVerified: true, isOauth: true });
    done(null, user);
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    findUserByKeyword(id).then((user) => done(null, user)).catch((err) => done(err, null));
  });
};
