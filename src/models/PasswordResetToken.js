'use strict';

const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const Schema = mongoose.Schema;
const Long = Schema.Types.Long;

var passwordResetTokenSchema = new Schema({
    id: {
        type: Long,
        required: true,
        unique: true,
    },
    token: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true,
        default: Date.now() + (1 * 1000 * 60 * 60 * 24)
    }
});

module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema);