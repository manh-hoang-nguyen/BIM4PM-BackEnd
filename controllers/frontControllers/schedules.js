const Schedule = require("../../models/Schedule");
const asyncHandler = require("../../middleware/asyncHandler");

//@desc     Create schedule
//@route    POST /project/:projectId/schedules
//@access   Private

exports.createSchedule = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  req.body.project = projectId;
  req.body.user = req.user._id;
  // req.body.categories = req.body.categories.split(',');
  // req.body.parameters = req.body.parameters.split(',');
  const schedule = await Schedule.create(req.body);
  res.status(200).json({
    success: true,
    data: schedule
  });
});

exports.getSchedules = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const schedules = await Schedule.find({ project: projectId });
  res.status(200).json({
    success: true,
    data: schedules
  });
});

exports.getSchedule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const schedule = await Schedule.findById(id);
  res.status(200).json({
    success: true,
    data: schedule
  });
});

//@desc     Update schedule
//@route    PUT /project/:projectId/schedules/:scheduleId
//@access   Private
exports.updateSchedule = asyncHandler(async (req, res, next) => {
  const { projectId, scheduleId } = req.params;

  const option = {
    $set: {
      categories: req.body.categories.split(","),
      parameters: req.body.parameters.split(",")
    }
  };

  const schedule = await Schedule.findOneAndUpdate(
    { _id: scheduleId, project: projectId },
    option,
    { upsert }
  );

  res.status(200).json({
    success: true,
    data: schedule
  });
});
