const { Router } = require('express');
const { postUserHandler, putVerifyEmail, putNameById, putPasswordById, getUsers } = require('./handler');

const router = Router();


router.post('/users', postUserHandler);
router.get('/verify-email', putVerifyEmail);
router.get('/users', getUsers);
router.put('/users/edit-name/:id', putNameById);
router.put('/users/edit-password/:id', putPasswordById);

module.exports = router;
