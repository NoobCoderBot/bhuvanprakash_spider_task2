const mongoose = require('mongoose');
const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  description: String,
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Activity', activitySchema);
