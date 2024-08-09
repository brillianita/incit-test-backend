const { Router } = require('express');
const { postUserHandler, putVerifyEmail, putNameById, putPasswordById } = require('./handler');

const router = Router();


router.post('/users', postUserHandler);
router.get('/verify-email', putVerifyEmail);
router.put('/users/edit-name/:id', putNameById);
router.put('/users/edit-password/:id', putPasswordById);

module.exports = router;
