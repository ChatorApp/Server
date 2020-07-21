'use strict';

const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const Schema = mongoose.Schema;
const Long = Schema.Types.Long;

var uploadSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    author: {
        type: Long,
        required: true,
    },
});

module.exports = mongoose.model('Upload', uploadSchema);