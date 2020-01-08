const Schedule = require("../../models/Schedule");
const asyncHandler = require("../../middleware/asyncHandler");
exports.createSchedule = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  req.body.project = projectId;
  try {
    const { columns, sort } = req.body;
    const schedule = await Schedule.create(req.body);
    res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error) {}
});
