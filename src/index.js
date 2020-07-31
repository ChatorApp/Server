const express = require('express');
const http = require('http');
const mongoose = require('mongoose');

const passport = require('passport');
const { Strategy } = require('passport-http-bearer');

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const AuthMiddleware = require('./middleware/Auth');
const ErrorMiddleware = require('./middleware/Error');
const NotFoundMiddleware = require('./middleware/NotFound');

const User = require('./models/User');

passport.use(
  new Strategy((token, cb) => {
    User.findOne({ token }, (err, user) => {
      if (err) return cb(err);
      if (!user) return cb(null, false);
      return cb(null, user, { scope: 'all' });
    });
  }),
);

app.use(express.json({ limit: '2mb' }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const routes = require('./routes');

app.use(AuthMiddleware.checkToken);

app.use('/api', routes);
app.use(ErrorMiddleware.errorHandler);
app.use(NotFoundMiddleware.notFound);

mongoose.connect(`mongodb://${process.env.MONGO_CONNECTION}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  autoCreate: true,
});

require('./sockets')(io);

const db = mongoose.connection;

db.once('open', () => console.log('Database connection is successful'));

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Chator API is now listening on https://chator.app:${port}`));
