const { Router } = require('express');
const { postAuthentication } = require('./handler');

const router = Router();


router.post('/login', postAuthentication);

module.exports = router;
