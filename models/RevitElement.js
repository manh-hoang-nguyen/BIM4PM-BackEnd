const mongoose = require("mongoose");

const Point = require("./children/Point");

const RevitElementSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.ObjectId,
      ref: "Project",
      required: [true, "Please add project id"]
    },

    version: {
      type: mongoose.Schema.ObjectId,
      ref: "Version",
      required: [true, "Please define the version"]
    },

    guid: {
      type: String,
      required: [true, "Please add project guid"]
    },
    name: String,

    elementId: String,

    category: String,

    level: String,

    parameters: String,

    sharedParameters: String,

    worksetId: String,

    location: String,

    boundingBox: String,

    centroid: String,

    typeId: String,

    volume: String
  },
  { timestamps: true }
);

RevitElementSchema.index({ project: 1, guid: 1, version: 1 }, { unique: true }); //indexing
module.exports = mongoose.model("RevitElement", RevitElementSchema);
