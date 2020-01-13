const express = require('express');
const router = express.Router();

const advancedResults = require('../../middleware/advancedResults');

const Project = require('../../models/Project');

const { protect } = require('../../middleware/auth');
const elementRouter = require('./revitElements');
const commonRouter = require('./common');
const scheduleRouter = require('./schedules');

router.use('/:projectId/elements', elementRouter);
router.use('/:projectId', commonRouter);
router.use('/:projectId/schedules', scheduleRouter);

module.exports = router;