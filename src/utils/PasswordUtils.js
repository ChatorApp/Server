'use strict';
const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {
    encrypt: async (messageToEncrypt) => await bcrypt.hash(messageToEncrypt, saltRounds),
    compare: async (plainPassword, encryptedPassword) => await bcrypt.compare(plainPassword, encryptedPassword),
};