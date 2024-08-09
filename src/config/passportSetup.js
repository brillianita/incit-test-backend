// eslint-disable-next-line no-unused-vars
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { addUser, findUserById } = require('../services/usersService');
require('dotenv').config();
module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3300/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json;
    const user = await addUser({ name, email, password: null, confirmPassword: null, isVerified: true });
    done(null, user);
  }));

  passport.serializeUser((user, done) => {
    console.log(2);
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log(id);
    findUserById(id).then((user) => done(null, user)).catch((err) => done(err, null));
  });
};
