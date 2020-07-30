const jwt = require('jsonwebtoken');

module.exports = {
  checkToken: (request, response, next) => {
    const authHeader = request.get('authorization');
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
            if (error) console.log(error);
            request.user = user;
            next();
          });
        } catch (e) {
          console.error('Error', e);
          next();
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
