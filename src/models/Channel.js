const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const { Schema } = mongoose;
const { Long } = Schema.Types;

const channelSchema = new Schema({
  id: {
    type: Long,
    required: true,
    unique: true,
  },
  category: {
    type: Long,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  server: {
    type: Long,
    required: true,
  },
});

module.exports = mongoose.model('Channel', channelSchema);
