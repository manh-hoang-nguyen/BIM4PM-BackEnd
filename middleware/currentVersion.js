const Version = require('../models/Version');
const asyncHandler = require('./asyncHandler');

exports.currentVersion = asyncHandler(async (req,res, next)=>{
    const versions = await Version.findOne({project:req.params.projectId}).select('versions'); 

    const currentVersion = versions.versions[versions.versions.length-1];
 
    req.body.currentVersion = currentVersion._id;

    next();
})