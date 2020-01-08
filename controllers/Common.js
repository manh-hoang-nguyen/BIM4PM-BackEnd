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

  async.mapSeries(
    categories.category,
    function(category, callback) {
      let parameters;

      RevitElement.findOne(
        {
          project: projectId,
          category
        },
        'parameters geometryParameters sharedParameters',
        function(err, param) {
          parameters = [
            ...new Set(
              deserilizeParam(param.parameters, false).concat(
                deserilizeParam(param.geometryParameters, false),
                deserilizeParam(param.sharedParameters, true)
              )
            )
          ];

          if (err) return callback(err);

          callback(null, {
            category,
            parameters
          });
        }
      );
    },
    function(err, results) {
      res.status(200).json({
        success: true,
        data: results
      });
    }
  );
});

// return an array of parameter name
function deserilizeParam(paramNameValue, isShared) {
  let parameters;

  let array = paramNameValue.split(';');

  array.pop();

  let para = array.map(item => item.split(':')[1]);

  parameters = para.map(p => {
    return { name: p.split('=')[0], isShared };
  });

  return parameters;
}
