const mongoose = require('mongoose');

const ScheduleSchema = mongoose.Schema({
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: [true, 'Please add project id']
  },
  name: {
    type: String,
    require: [true, 'Please add the name of schedule']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please add user id']
  },  
  isShared: {
    type: Boolean,
    default: false
  },
  isRevit:Boolean,
  shareWith:[{
    user:mongoose.Schema.ObjectId
  }],
  data: []
});

ScheduleSchema.index({
  project: 1,
  name: 1
}, {
  unique: true
}); //indexing
module.exports = mongoose.model('Schedule', ScheduleSchema);

// https://stackoverflow.com/questions/30464675/create-table-from-json-pure-javascript