const jwt = require('jsonwebtoken');

module.exports = ((io) => {
    io.on('connection', socket => {
        console.log('New WS Connection...');
        socket.on('SEND_MESSAGE', data => {
            const { jwt_token, message } = data;
            const verifiedToken = jwt.verify(jwt_token, process.env.TOKEN_SECRET);
            io.emit('MESSAGE', {
                user: {
                    name: verifiedToken.username,
                    id: verifiedToken.id
                },
                message: {
                    content: message,
                    timestamp: Date.now(),
                },
            });
        });
    });
});