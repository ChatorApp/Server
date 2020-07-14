'use strict';

const express = require('express');
const http = require('http');
const mongoose = require('mongoose');

const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;

const User = require('./models/User');

const AuthMiddleware = require('./middleware/Auth');

const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

require('dotenv').config();

passport.use(new Strategy(
    function (token, cb) {
        User.findOne({ token: token }, (err, user) => {
            if (err) return cb(err);
            if (!user) return cb(null, false);
            return cb(null, user, { scope: 'all' });
        });
    }
));

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(AuthMiddleware.checkToken);

const routes = require('./routes');

app.use('/api', routes);

mongoose.connect(`mongodb://${process.env.MONGO_CONNECTION}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoCreate: true,
});

io.on('connection', socket => {
    console.log('New WS Connection...');
    socket.on('SEND_MESSAGE', data => {
        io.emit('MESSAGE', data);
    })
});

const db = mongoose.connection;

db.once('open', () => console.log('Database connection is successful'));

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Chator API is now listening on https://chator.app:${port}`));