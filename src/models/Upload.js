const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const { Schema } = mongoose;
const { Long } = Schema.Types;

const uploadSchema = new Schema({
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
