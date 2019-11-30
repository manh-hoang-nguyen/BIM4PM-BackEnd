//db.products.update({},{$push:{last_viewed:{$each:["skis"],$slice:-5}}})
const mongoose = require('mongoose');
const ErrorResponse =require('../utils/errorReponse');
const asyncHandler = require('../middleware/asyncHandler');
const Version = require('../models/Version');
const RevitElement = require('../models/RevitElement');
const CheckUserRole = require('../utils/checkUserRole');

//@desc     Get all versions
//@route    GET /api/v1/versions
//@route    GET /api/v1/projects/:projectId/versions
//@access   Public

exports.getVersions = asyncHandler(async (req,res, next)=>{
     if(req.params.projectId){
        const versions = await Version.find({project:req.params.projectId}).select('versions');
       
        res.status(200).json({
            success:true,
            data: versions
        })
     }
     else{
        res 
        .status(200)
        .json( res.advancedResults) ;
     }
   
})

//@desc     Get current version 
//@route    GET /api/v1/projects/:projectId/versions/current
//@access   Public

exports.getCurrentVersion = asyncHandler(async (req,res, next)=>{
    
    const versions = await Version.findOne({project:req.params.projectId}).select('versions'); 

    const currentVersion = versions.versions[versions.versions.length-1];
    
    res.status(200).json({
        success:true,
        data: currentVersion
    })
   
  
})

//@desc     Create version 
//@route    POST /api/v1/projects/:projectId/versions
//@access   Private 
exports.createVersion = asyncHandler(async (req,res, next)=>{
   const {projectId} = req.params;

    req.body.createdBy = req.user.id;
    console.log(req.user.id)
    CheckUserRole(projectId, req, next)

    let version = await Version.findOne({project:req.params.projectId});
    
    if(!version) return next(new ErrorResponse(`Verion is not found`));
     
        req.body.version = version.versions.length + 1;
         
        if(req.body.version > 1){
            try {
                 // duplicate element with new version
                let oldVersion = version.versions[version.versions.length-2];
                let newVersion = version.versions[version.versions.length-1]; 

                const elements  = await RevitElement.find({project:projectId, version:oldVersion._id}); 
               
                await elements.forEach((element)=>{  
                    element.version = newVersion._id;
                    element._id =  mongoose.Types.ObjectId();
                    element.isNew = true;
                    element.save();
                    
                });
            } catch (error) {
                next(new ErrorResponse(` Fail because no element in the precedent version`))
            }
           
        }
       

        version = await Version.findOneAndUpdate({project:projectId},{$push:{versions:req.body}},{
            new: true,
            runValidators:true
        }) 
    
  
    
          
    res.status(200).json((typeof elements !== 'undefined')?{
        success: true,
        copyElement: elements.length,
        data: version
    } : {  success: true, data: version})
})

//@desc     Delete project version 
//@route    DELETE /api/v1/projects/:projectId/versions
//@access   Private 
exports.deleteProjectVersion = asyncHandler(async (req,res, next)=>{ 

    CheckUserRole(req.params.projectId, req, next)

    let version = await Version.findOne({project:req.params.projectId});

    
    if(!version) return next(new ErrorResponse(`Version ${req.body.version} of project ${req.params.projectId} is not found`));
    //Delete elements of version
    let deletedVersionId;
    version.versions.forEach(version => {
        if(version.version==req.body.version) {
            deletedVersionId = version._id;
        }
    })
    const nbrDeletedElement = await RevitElement.deleteMany({version:deletedVersionId}).countDocuments();
    
    //Delete version
    version = await Version.findOneAndUpdate({project:req.params.projectId},{$pull:{versions:{version: req.body.version}}},{
        new: true,
        runValidators:true
    })  

    res.status(200).json({
        success: true,
        deletedElement: nbrDeletedElement,
        data: version
    })
})