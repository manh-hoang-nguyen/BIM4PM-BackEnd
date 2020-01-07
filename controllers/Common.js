const Common = require('../models/Common');
const RevitElement = require('../models/RevitElement');
const asyncHandler = require('../middleware/asyncHandler');
const async = require('async');
//@desc     Get categories
//@route    GET /api/v1/projects/:projectId/category
//@access   Public

exports.getCatAndParameter = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const categories = await Common.findOne({
    project: projectId
  }).select('category');
  let resArr = [];

  // https://stackoverflow.com/questions/18983138/callback-after-all-asynchronous-foreach-callbacks-are-completed
  const loop = categories.category.forEach(category => {
    let parameters;
    let revitParameters;
    let geometryParameters;
    let sharedParameters;
    RevitElement.findOne({ category })
      .select('parameters geometryParameters sharedParameters')
      .then(param => {
        revitParameters = deserilizeParam(param.parameters);
        geometryParameters = deserilizeParam(param.geometryParameters);
        sharedParameters = deserilizeParam(param.sharedParameters);
        revitParameters.concat(geometryParameters, sharedParameters);
        parameters = [...new Set(revitParameters)];

        resArr.push({ category, parameters });
      });
  });
  Promise.all(loop).then(() => {
    res.status(200).json({
      success: true,
      data: resArr
    });
  });
});

// return an array of parameter name
function deserilizeParam(paramNameValue) {
  let parameters;
  let array = paramNameValue.split(';');

  array.pop();
  let para = array.map(item => item.split(':')[1]);
  parameters = para.map(p => p.split('=')[0]);
  return parameters;
}
