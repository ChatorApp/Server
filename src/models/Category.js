const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const { Schema } = mongoose;
const { Long } = Schema.Types;

const categorySchema = new Schema({
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
