const jwt = require('jsonwebtoken');

const Generators = require('../../utils/Generators');
const Message = require('../../models/Message');

module.exports = {
    trigger: (io, data) => {
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
        Message.create({
            id: Generators.generateId(),
            author: verifiedToken.id,
            content: message,
        });
    }
};