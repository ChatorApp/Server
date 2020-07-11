'use strict';

const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const Schema = mongoose.Schema;
const Long = Schema.Types.Long;

var serverSchema = new Schema({
    id: {
        type: Long,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    iconUrl: {
        type: String,
        required: true,
    },
    private: {
        type: Boolean,
        required: true,
        default: true,
    },
    owner: {
        type: Long,
        required: true,
    },
});

module.exports = mongoose.model('Server', serverSchema);