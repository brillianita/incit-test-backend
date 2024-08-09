const { Router } = require('express');
const { postUserHandler, putVerifyEmail, putNameById } = require('./handler');

const router = Router();


router.post('/users', postUserHandler);
router.get('/verify-email', putVerifyEmail);
router.put('/users/:id', putNameById);

module.exports = router;
