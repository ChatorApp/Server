'use strict';

const express = require('express');
const router = express.Router();

const AuthMiddleware = require('./middleware/Auth');

router.get('/', (request, response) => {
    response.status(200).json({ message: 'Welcome to the Chator API' });
});

router.use('/auth', require('./routes/auth'));
router.use('/categories', AuthMiddleware.checkloggedIn, require('./routes/category'));
router.use('/channels', AuthMiddleware.checkloggedIn, require('./routes/channel'));
router.use('/servers', AuthMiddleware.checkloggedIn, require('./routes/server'));
router.use('/users', AuthMiddleware.checkloggedIn, require('./routes/user'));

module.exports = router;