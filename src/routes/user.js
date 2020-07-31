const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/me', async (request, response, next) => {
  const user = await User.findOne({ id: request.user.id });

  if (!user) return next(new Error('User could not be found'));

  return response.status(200).json({
    id: user.id,
    username: user.username,
  });
});

module.exports = router;
