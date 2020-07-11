'use strict';

const express = require('express');
const router = express.Router();

const AuthMiddleware = require('./middleware/Auth');

router.get('/', (request, response) => {
    response.status(200).json({message: 'Welcome to the Chator API'});
});

router.use('/auth', require('./routes/auth'));
router.use('/servers', AuthMiddleware.checkloggedIn, require('./routes/server'));

module.exports = router;