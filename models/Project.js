const mongoose = require('mongoose');

<<<<<<< HEAD
const ProjectSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please add a name"],
    maxlength: [50, "Name can not more than 50 charecters"]
  },
  description: {
    type: String,
    required: [true, "please add a description"],
    maxlength: [500, "Description can not more than 500 charecters"]
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  members: [{
    user: {
=======
const ProjectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please add a name'],
      unique: true,
      maxlength: [50, 'Name can not more than 50 charecters']
    },
    description: {
      type: String,
      required: [true, 'please add a description'],
      maxlength: [500, 'Description can not more than 500 charecters']
    },
    owner: {
>>>>>>> 6eac544275278ef422042472b3cc0f0898be6795
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
<<<<<<< HEAD
    role: {
      type: String,
      required: [true, "Please define the role of member"],
      enum: ["administrator", "member"]
    }
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
=======
    members: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: true
        },
        role: {
          type: String,
          required: [true, 'Please define the role of member'],
          enum: ['administrator', 'member']
        }
      }
    ]
>>>>>>> 6eac544275278ef422042472b3cc0f0898be6795
  },
  toObject: {
    virtuals: true
  }
});

//Cascade delete Modification, Element, Comment when Project is deleted
<<<<<<< HEAD
ProjectSchema.pre("remove", async function (next) {
=======
ProjectSchema.pre('remove', async function(next) {
>>>>>>> 6eac544275278ef422042472b3cc0f0898be6795
  console.log(
    ` , Elements, Comments, Versions being removed from projects ${this._id}`
  );
<<<<<<< HEAD
  await this.model("Version").deleteMany({
    project: this._id
  });
  await this.model("Modification").deleteMany({
    project: this._id
  });
  await this.model("RevitElement").deleteMany({
    project: this._id
  });
  await this.model("Comment").deleteMany({
    project: this._id
  });
=======

  await this.model('Version').deleteMany({ project: this._id });

  await this.model('RevitElement').deleteMany({ project: this._id });
  await this.model('Comment').deleteMany({ project: this._id });
>>>>>>> 6eac544275278ef422042472b3cc0f0898be6795

  // When project created, update user's projects
  let update = {
    $pull: {
      projects: {
        project: this._id
      }
    }
  };

<<<<<<< HEAD
  await this.model("User").findOneAndUpdate({
    _id: this.owner
  }, update);
=======
  await this.model('User').findOneAndUpdate({ _id: this.owner }, update);
>>>>>>> 6eac544275278ef422042472b3cc0f0898be6795

  next();
});

// When project created, update user's projects and create project version
<<<<<<< HEAD
ProjectSchema.pre("save", async function (next) {
=======
ProjectSchema.pre('save', async function(next) {
  const id = mongoose.Types.ObjectId();
>>>>>>> 6eac544275278ef422042472b3cc0f0898be6795
  let update = {
    $push: {
      projects: {
        project: this._id
      }
    }
  };

<<<<<<< HEAD
  await this.model("User").findOneAndUpdate({
    _id: this.owner
  }, update);
  await this.model("Version").create({
    project: this._id
=======
  await this.model('User').findOneAndUpdate({ _id: this.owner }, update);
  await this.model('Version').create({
    project: this._id,
    versions: [{ _id: id, version: 1, createdBy: this.owner }]
>>>>>>> 6eac544275278ef422042472b3cc0f0898be6795
  });
  next();
});

//reverse polulate with virtuals
ProjectSchema.virtual('versions', {
  ref: 'Version',
  localField: '_id',
  foreignField: 'project',
  justOne: false
});

<<<<<<< HEAD
module.exports = mongoose.model("Project", ProjectSchema);
=======
module.exports = mongoose.model('Project', ProjectSchema);
>>>>>>> 6eac544275278ef422042472b3cc0f0898be6795
