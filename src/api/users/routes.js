const { Router } = require('express');
const { postUserHandler } = require('./handler');

const router = Router();


router.post('/users', postUserHandler);

module.exports = router;
