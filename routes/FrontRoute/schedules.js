const express = require("express");
const router = express.Router({ mergeParams: true });

const { protect } = require("../../middleware/auth");

const {
  createSchedule,
  getSchedules,
  getSchedule,
  updateSchedule
} = require("../../controllers/frontControllers/schedules");

router
  .route("/")
  .get(getSchedules)
  .post(protect, createSchedule);

router
  .route("/:id")
  .get(getSchedule)
  .put(updateSchedule);

module.exports = router;
