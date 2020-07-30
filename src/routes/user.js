const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/me', async (request, response) => {
  const user = await User.findOne({ id: request.user.id });
  return response.status(200).json({
    id: user.id,
    username: user.username,
  });
});

module.exports = router;
