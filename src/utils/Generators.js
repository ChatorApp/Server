'use strict';

const intformat = require('biguint-format');
const FlakeId = require('flake-idgen');

module.exports = {
    generateId: () => intformat(new FlakeId({ epoch: 1593558000000 }).next())
};