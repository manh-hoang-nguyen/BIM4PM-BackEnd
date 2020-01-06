const async = require('async');
const ErrorResponse = require('../utils/errorReponse');
const asyncHandler = require('../middleware/asyncHandler');
const RevitElement = require('../models/RevitElement');
const Project = require('../models/Project');
const Version = require('../models/Version');
const CheckUserRole = require('../utils/checkUserRole');

//@desc     Get elements of project of current version
//@route    GET /api/v1/projects/:projectId/elements  ==> get all elements
//@route    GET /api/v1/projects/:projectId/elements/guid/:guid ==> get a specific element
//@access   Public
exports.getElementsOfVersion = asyncHandler(async (req, res, next) => {
  const { projectId, guid } = req.params;

  let elements;
  const version = req.query.version;

  if (version) {
    let v;

    Version.findOne({ project: projectId }, async function(err, items) {
      items.versions.forEach(item => {
        if (item.version == version) {
          v = item;
        }
      });

      if (typeof v == 'undefined') next(new ErrorResponse(`Version not found`));

      if (typeof guid !== 'undefined') {
        elements = await RevitElement.find({
          project: projectId,
          guid: guid,
          version: v._id
        });
      } else {
        elements = await RevitElement.find({
          project: projectId,
          version: v._id
        }).populate({ path: 'history.user', select: 'name' });
      }

      res.status(200).json({
        success: true,
        version: v.version,
        data: elements
      });
    });
  } else {
    if (typeof guid !== 'undefined') {
      elements = await RevitElement.find({
        project: projectId,
        guid: guid,
        version: req.currentVersion._id
      });
    } else {
      elements = await RevitElement.find({
        project: projectId,
        version: req.currentVersion._id
      });
    }

    res.status(200).json({
      success: true,
      currentVersion: req.currentVersion.version,
      data: elements
    });
  }
});

//@desc     Create single Revit element with current version
//@route    POST /api/v1/projects/:projectId/elements/guid/:guid
//@access   Private
exports.createElement = asyncHandler(async (req, res, next) => {
  const { projectId, guid } = req.params;

  req.body.project = projectId;
  req.body.guid = guid;
  req.body.version = req.currentVersion._id;

  const element = await RevitElement.findOneAndUpdate(
    {
      project: projectId,
      guid: guid
    },
    req.body,
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: element
  });
});
//@desc     Get history of Revit element  of current version
//@route    GET /api/v1/projects/:projectId/elements/guid/:guid/history
//@access   Private
exports.getHistory = asyncHandler(async (req, res, next) => {
  const { projectId, guid } = req.params;

  let version = req.currentVersion._id;

  const history = await RevitElement.findOne({
    project: projectId,
    version,
    guid
  })
    .select('history')
    .populate({ path: 'history.user', select: 'name' });

  if (!history) {
    return next(
      new ErrorResponse(
        `History not found with guid of ${req.params.guid}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: history
  });
});
//@desc     Create many Revit elements with current version
//@route    POST /api/v1/projects/:projectId/elements
//@access   Private
exports.createElements = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  async.mapSeries(
    req.body,
    function iterator(item, callback) {
      item.project = projectId;
      item.version = req.currentVersion._id;
      item.history = [
        {
          modifiedAt: Date.now(),
          user: req.user._id,
          isFirstCommit: true
        }
      ];

      //https://mongoosejs.com/docs/api.html#model_Model.create
      new RevitElement(item, true).save(function(err, data) {
        callback(err, data);
      });
    },
    function done(err, datas) {
      res.json(err ? { message: err } : datas);
    }
  );
});

//@desc     Delete many Revit elements with current version
//@route    DELETE /api/v1/projects/:projectId/elements
//@access   Private
exports.deleteElements = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  async.mapSeries(
    req.body,
    function iterator(item, callback) {
      let project = projectId;
      let version = req.currentVersion._id;
      let guid = item.guid;
      RevitElement.findOneAndRemove({ project, version, guid }, function(
        data,
        err
      ) {
        callback(data, err);
      });
    },
    function done(err, datas) {
      res.json(err ? { message: err } : 'Delete successfully');
    }
  );
});

//@desc     Update many Revit elements with current version
//@route    PUT /api/v1/projects/:projectId/elements
//@access   Private
exports.updateElements = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  async.mapSeries(
    req.body,
    function iterator(item, callback) {
      let version = req.currentVersion._id;
      let guid = item.guid;
      let option = {
        $push: {
          history: {
            modifiedAt: Date.now(),
            user: req.user._id,
            geometryChange: item.history[0].geometryChange,
            parameterChange: item.history[0].parameterChange,
            sharedParameterChange: item.history[0].sharedParameterChange
          }
        },
        $set: {
          name: item.name,
          category: item.category,
          level: item.level,
          parameters: item.parameters,
          geometryParameters: item.geometryParameters,
          sharedParameters: item.sharedParameters,
          worksetId: item.worksetId,
          location: item.location,
          boundingBox: item.boundingBox,
          centroid: item.centroid,
          typeId: item.typeId,
          volume: item.volume,
          updatedAt: Date.now()
        }
      };

      RevitElement.findOneAndUpdate(
        { project: projectId, version, guid },
        option,
        { new: true },
        (data, error) => {
          callback(data, error);
        }
      );
    },
    function done(err, datas) {
      res.json(err ? { message: err } : 'Update successfully');
    }
  );
});

exports.deleteAllForTest = asyncHandler(async (req, res, next) => {
  await RevitElement.deleteMany({ project: req.params.projectId });
  res.json('success');
});
