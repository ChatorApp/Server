'use strict';

const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const Schema = mongoose.Schema;
const Long = Schema.Types.Long;

var userSchema = new Schema({
    id: {
        type: Long,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 32,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    emailConfirmed: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('User', userSchema);