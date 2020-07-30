const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {
  encrypt: async (messageToEncrypt) => {
    bcrypt.hash(messageToEncrypt, saltRounds);
  },
  compare: async (plainPassword, encryptedPassword) => {
    bcrypt.compare(plainPassword, encryptedPassword);
  },
};
