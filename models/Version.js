const mongoose = require('mongoose');

const VersionSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: [true, 'Please add project id']
    },
    versions: [
      {
        version: {
          type: Number,
        //   required: [true, 'Please define the version']
        },
        description: {
          type: String,
          default: 'No description'
        },
        createdBy: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        //   required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

VersionSchema.statics.findByVersion = function(projectId, version, callback) {
  this.findOne({ project: projectId }, function(err, items) {
    items.versions.forEach(item => {
      if (item.version == version) {
        return item, callback;
      }
    });
  });
};
 
const Model = mongoose.model('Version', VersionSchema);
Model.syncIndexes(); // Handling errour duplicate key 
module.exports = Model;
