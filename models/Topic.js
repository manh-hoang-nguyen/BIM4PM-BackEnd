const mongoose = require('mongoose');

const TopicSchema = mongoose.Schema({
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: [true, 'Please add project id']
  },
  title:{
    type:String,
    require:[true, 'Please add a title'],
    maxlength: [50, 'Title can not have more 50 characters']
  }, 
  elements:[String], //array of guid
  text:{
    type: String,
    require: [true, 'please add some text']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: true
  },
  degree:{
    type:String,
    enum:['normal', 'high', 'very high'],
    default: 'normal'
  },
  comments: [{
    type: {
      type: String,
      required: true,
      enum: ['comment', 'demand', 'question'],
      default: 'comment'
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: true
    },
    text: {
      type: String,
      require: [true, 'Please add a comment']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date
    }
  }]
},{
  timestamps: true
});

TopicSchema.index({
  project: 1
}); //indexing

module.exports = mongoose.model('Topic', TopicSchema);