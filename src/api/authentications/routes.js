const { Router } = require('express');
const {
  postAuthenticationByEmail,
  postAuthenticationByGoogle,
  profile,
  postAuthenticationByFacebook } = require('./handler');
const passport = require('passport');
const router = Router();


router.post('/login', postAuthenticationByEmail);
router.get('/', (req, res) => {
  res.send('<a href="/auth/facebook">Authenticate with Facebook</a> <a href="/auth/google">Authenticate with Google</a>');
});


router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), postAuthenticationByGoogle);

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), postAuthenticationByFacebook);
router.get('/profile', profile);

module.exports = router;
