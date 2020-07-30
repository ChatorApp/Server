const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const { Schema } = mongoose;
const { Long } = Schema.Types;

const messageSchema = new Schema({
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
