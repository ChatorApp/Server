//Events
const connectEvent = require('./events/connect');

module.exports = ((io) => {
    io.on('connection', socket => connectEvent.trigger(io, socket));
});