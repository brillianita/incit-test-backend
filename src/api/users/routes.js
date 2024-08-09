const { Router } = require('express');
const { postUserHandler, putVerifyEmail } = require('./handler');

const router = Router();


router.post('/users', postUserHandler);
router.get('/verify-email', putVerifyEmail);

module.exports = router;
