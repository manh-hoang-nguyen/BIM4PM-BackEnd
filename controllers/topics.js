const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const Topic = require('../models/Topic');
const ErrorResponse = require('../utils/errorReponse');
const Project = require('../models/Project');

//@desc     Create topic
//@route    POST /api/v1/projects/:projectId/topics
//@access   Private
exports.createTopic = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  req.body.project = projectId;
  req.body.user = req.user._id;

  const topic = await Topic.create(req.body);

  res.status(201).json({
    success: true,
    data: topic
  });
});

//@desc     Get topics of project
//@route    GET /api/v1/projects/:projectId/topics
//@access   Private
exports.getTopics = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const topic = await Topic.find({ project: projectId });

  res.status(201).json({
    success: true,
    data: topic
  });
});

//@desc     Add comment to topic
//@route    POST /api/v1/projects/:projectId/topics/:topicId
//@access   Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const { projectId, topicId } = req.params;

  req.body.user = req.user.id;

  let topic = await Topic.findById(topicId);

  if (!topic) {
    return next(
      new ErrorResponse(`Topic not found with id of ${req.params.topicId}`, 404)
    );
  }

  const option = {
    $push: {
      comments: req.body
    }
  };
  topic = await Topic.findByIdAndUpdate(topicId, option, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: topic
  });
});
