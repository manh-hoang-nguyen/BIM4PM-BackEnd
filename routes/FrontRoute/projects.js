const express = require('express');
const router = express.Router();

const advancedResults = require('../../middleware/advancedResults');

const Project = require('../../models/Project');

const { protect } = require('../../middleware/auth');
const elementRouter = require('./revitElements');

router.use('/:projectId/elements', elementRouter);

module.exports = router;