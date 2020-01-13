const mongoose = require('mongoose');

const ScheduleSchema = mongoose.Schema({
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: [true, 'Please add project id']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please add user id']
  },
  name: {
    type: String,
    required: true,
    default: 'Schedules' + Math.random()
  },
  sharedWith: [mongoose.Schema.ObjectId],
  categories: [String],
  parameters: [String],
  sort: [String]
});

ScheduleSchema.index({ project: 1 });
const Model = mongoose.model('Schedule', ScheduleSchema);
Model.syncIndexes(); // Handling error duplicate key
module.exports = Model;
