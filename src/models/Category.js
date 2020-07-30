'use strict';

const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const Schema = mongoose.Schema;
const Long = Schema.Types.Long;

var categorySchema = new Schema({
    id: {
        type: Long,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    server: {
        type: Long,
        required: true,
    },
});

module.exports = mongoose.model('Category', categorySchema);