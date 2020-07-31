const jwt = require('jsonwebtoken');

module.exports = {
  checkToken: (request, response, next) => {
    const authHeader = request.get('authorization');
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const result = jwt.verify(token, process.env.TOKEN_SECRET);
          request.user = result;
        } catch (e) {
          next(e);
        }
      } else {
        next();
      }
    } else {
      next();
    }
  },
  checkloggedIn: (request, response, next) => {
    if (request.user) {
      next();
    } else {
      response
        .status(401)
        .json({ error: 'Access Denied. You are not logged in or your session has expired' });
    }
  },
};
