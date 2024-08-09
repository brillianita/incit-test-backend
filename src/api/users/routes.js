const { Router } = require('express');
const { postUserHandler, putVerifyEmail, putNameById, putPasswordById, getUsers, getUsersStatistics, resendEmailVerification } = require('./handler');

const router = Router();


router.post('/users', postUserHandler);
router.get('/verify-email', putVerifyEmail);
router.post('/resend-email-verification', resendEmailVerification);
router.get('/users', getUsers);
router.get('/users/statistics', getUsersStatistics);
router.put('/users/edit-name/:id', putNameById);
router.put('/users/edit-password/:id', putPasswordById);

module.exports = router;
