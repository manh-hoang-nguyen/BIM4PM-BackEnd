const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CommentSchema = mongoose.Schema({
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: [true, 'Please add project id']
  },
  guid: {
    type: String,
    required: [true, 'Please add guid']
  },
  comments: [
    {
      type: {
        type: String,
        required: true,
        enum: ['comment', 'demand', 'question'],
        default: 'comment'
      },
      user: {
        type: mongoose.Schema.ObjectId, //To fix bug require nested schema https://stackoverflow.com/questions/38451898/how-to-add-validation-on-mongoose-child-element-in-a-schema
        ref: 'User',
        require: true
      },
      text: {
        type: String,
        require: [true, 'Please add a comment']
      },
      createdAt: {
        type: Date,
        default: Date.now()
      },
      updatedAt: {
        type: Date
      }
    }
  ]
});

CommentSchema.index({ project: 1}); //define index
const Model =  mongoose.model('Comment', CommentSchema);
Model.syncIndexes();
module.exports = Model;
