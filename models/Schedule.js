const mongoose = require("mongoose");

const ScheduleSchema = mongoose.Schema({
  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    required: [true, "Please add project id"]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please add user id"]
  },
  sharedWith: [mongoose.Schema.ObjectId],
  column: [String],
  sort: [String]
});

ScheduleSchema.index({ project: 1 });
module.exports = mongoose.model("Schedule", ScheduleSchema);
