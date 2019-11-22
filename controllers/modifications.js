//db.products.update({},{$push:{last_viewed:{$each:["skis"],$slice:-5}}})
const ErrorResponse =require('../utils/errorReponse');
const asyncHandler = require('../middleware/asyncHandler');
const Modification = require('../models/Modification');
const Project = require('../models/Project');
const CheckUserRole = require('../utils/checkUserRole');

//@desc     Get all modifications 
//@route    GET /api/v1/projects/:projectId/modifications/guid/:guid
//@access   Public

exports.getModifications = asyncHandler(async (req,res, next)=>{
   
      
        const {projectId, guid} = req.params;
        
        let modifications; 
        
        if( typeof guid !== 'undefined'){
             
            modifications = await Modification.find({project:projectId, guid:guid}).select('modifications');
        }
        else{ 

            modifications = await Modification.find({project: projectId})
        }
       
        res.status(200).json({
            success:true,
            data: modifications
        })
    
})

//@desc     Create modification 
//@route    POST /api/v1/projects/:projectId/modifications/guid/:guid
//@access   Private

exports.createModification = asyncHandler(async (req,res, next)=>{
     
    const {projectId, guid} = req.params;
   
    req.body.createdBy = req.user.id;
    req.body.version = req.currentVersion._id;
    console.log(req.body)
    console.log(req.body.text)
    const options={
        $push:{
            modifications: req.body}
    }
    const modification = await Modification.findOneAndUpdate({
        project: projectId,
        guid:guid
    }
    ,options,
    {
        new: true,
        upsert: true,
        runValidators: true
    }) 

    res.status(200).json({
        success: true,
        data: modification
    })
})