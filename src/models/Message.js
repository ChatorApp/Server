'use strict';

const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const Schema = mongoose.Schema;
const Long = Schema.Types.Long;

var messageSchema = new Schema({
    id: {
        type: Long,
        required: true,
        unique: true,
    },
    author: {
        type: Long,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Message', messageSchema);