
// Events
const sendMessageEvent = require('./sendMessage');

module.exports = {
    trigger: (io, socket) => {
        console.log('New WS Connection...');
        socket.on('SEND_MESSAGE', data => sendMessageEvent.trigger(io, data));
    }
};