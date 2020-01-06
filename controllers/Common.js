const Common = require('../models/Common');
const RevitElement = require('../models/RevitElement');
const asyncHandler = require('../middleware/asyncHandler');

//@desc     Get categories
//@route    GET /api/v1/projects/:projectId/category
//@access   Public

exports.getCatAndParameter = asyncHandler(async (req, res, next) => {
    const {
        projectId
    } = req.params;

    const categories = await Common.findOne({
        project: projectId
    }).select('category');

    categories.forEach(category => {
        let array;
        let parameters, geometryParameters, sharedParameters;

        const params = RevitElement.findOne({
            category
        }).select('parameters geometryParameters sharedParameters');


        parameters = deserilizeParam(params.parameters);
        geometryParameters = deserilizeParam(params.geometryParameters);
        sharedParameters = deserilizeParam(params.sharedParameters);
    })
})

function deserilizeParam(paramNameValue) {
    let parameters;
    paramNameValue.split(';');
    paramNameValue.pop();
    parameters = paramNameValue.map(p => p.split("=")[0]);
    return parameters;
}