const { Router } = require('express');
const {
  postAuthenticationByEmail,
  postAuthenticationByGoogle,
  profile } = require('./handler');
const passport = require('passport');
const router = Router();


router.post('/login', postAuthenticationByEmail);
router.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), postAuthenticationByGoogle);
router.get('/profile', profile);

module.exports = router;
