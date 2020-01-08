const async = require('async');
const ErrorResponse = require('../../utils/errorReponse');
const asyncHandler = require('../../middleware/asyncHandler');
const RevitElement = require('../../models/RevitElement');
const Project = require('../../models/Project');
const Version = require('../../models/Version');
const CheckUserRole = require('../../utils/checkUserRole');

//@desc     Get elements of project of current version
//@route    GET /project/:projectId/elements
//@access   Public

exports.getElementsForSchedule = asyncHandler(async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { category } = req.query;

    const conditions = {
      project: projectId,
      category: { $in: category.split(',') }
    };

    let revitElements = RevitElement.find(conditions);
    //Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      revitElements = revitElements.sort(sortBy);
    } else {
      revitElements = revitElements.sort('-createdAt');
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await RevitElement.countDocuments();
    revitElements = revitElements.skip(startIndex).limit(limit);

    const results = await revitElements;
    //Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: results.length,
      pagination,
      data: results
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      error: error
    });
  }
});
