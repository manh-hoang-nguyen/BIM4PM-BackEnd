const mongoose = require('mongoose');

const ScheduleSchema = mongoose.Schema({
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: [true, 'Please add project id']
      }, 
      guid: {
        type: String,
        required: [true, 'Please add schedule guid ']
      },
      name:{
          type: String,
          require:[true, 'Please add the name of schedule']
      },
      data:[{
          x:String,
          y:String,
          value:String
      }]
});

ScheduleSchema.index({ project: 1}); //indexing
module.exports = mongoose.model('Schedule', ScheduleSchema);