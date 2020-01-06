const mongoose = require('mongoose');

<<<<<<< HEAD

const RevitElementSchema = mongoose.Schema({
    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: [true, 'Please add project id']
    },

    version: {
      type: mongoose.Schema.ObjectId,
      ref: 'Version',
      required: [true, 'Please define the version']
    },
    guid: {
      type: String,
      required: [true, 'Please add project guid']
    },
    topics: [{
=======
const RevitElementSchema = mongoose.Schema({
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: [true, 'Please add project id']
  },

  version: {
    type: mongoose.Schema.ObjectId,
    ref: 'Version',
    required: [true, 'Please define the version']
  },
  guid: {
    type: String,
    required: [true, 'Please add project guid']
  },
  topics: [
    {
>>>>>>> 6eac544275278ef422042472b3cc0f0898be6795
      topic: {
        type: mongoose.Schema.ObjectId,
        ref: 'Topic'
      }
<<<<<<< HEAD
    }],
    history: [{
=======
    }
  ],
  history: [
    {
>>>>>>> 6eac544275278ef422042472b3cc0f0898be6795
      modifiedAt: {
        type: Date,
        default: Date.now
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      isFirstCommit: {
        type: Boolean,
        default: false
      },
      geometryChange: {
        type: Boolean,
        default: false
      },
      parameterChange: {
        type: Boolean,
        default: false
      },
      sharedParameterChange: {
        type: Boolean,
        default: false
<<<<<<< HEAD
      },
=======
      }
    }
  ],
  name: String,
>>>>>>> 6eac544275278ef422042472b3cc0f0898be6795

  elementId: String,

  category: String,

  level: String,

  parameters: String,

<<<<<<< HEAD
    parameters: String,

    geometryParameters: String,
=======
  geometryParameters: String,
>>>>>>> 6eac544275278ef422042472b3cc0f0898be6795

  sharedParameters: String,

  worksetId: String,

  location: String,

  boundingBox: String,

  centroid: String,

  typeId: String,

<<<<<<< HEAD
    volume: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
  }

);
=======
  volume: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});
>>>>>>> 6eac544275278ef422042472b3cc0f0898be6795

RevitElementSchema.pre('save', async function (next) {
  const common = await this.model("Common").findOne({
    project: this.project
  });
  if (common) {
    if (!common.category.includes(this.category))
      common.category.push(this.category);
    common.save();
  } else {
    await this.model('Common').create({
      project: this.project,
      category: [this.category]
    })
  } 
  next();
})

RevitElementSchema.index({
  project: 1,
  guid: 1,
  version: 1
}, {
  unique: true
}); //indexing
module.exports = mongoose.model('RevitElement', RevitElementSchema);