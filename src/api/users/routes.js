const { Router } = require('express');
const { postUserHandler, putVerifyEmail, putNameById, putPasswordById, getUsers, getUsersStatistics, resendEmailVerification, getUsersById } = require('./handler');
const { verifyToken } = require('../../tokenize/tokenManager');
const router = Router();

router.post('/users', postUserHandler);
router.get('/verify-email', putVerifyEmail);
router.post('/resend-email-verification', resendEmailVerification);
router.get('/users', [verifyToken], getUsers);
router.get('/users/statistics', [verifyToken], getUsersStatistics);
router.put('/users/edit-name/:id', putNameById);
router.put('/users/edit-password/:id', putPasswordById);

router.get('/users/:id', getUsersById);

module.exports = router;
