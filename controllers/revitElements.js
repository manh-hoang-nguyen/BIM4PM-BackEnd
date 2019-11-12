//db.products.update({},{$push:{last_viewed:{$each:["skis"],$slice:-5}}})
const ErrorResponse =require('../utils/errorReponse');
const asyncHandler = require('../middleware/asyncHandler');
const RevitElement = require('../models/RevitElement');
const Project = require('../models/Project');
const CheckUserRole = require('../utils/checkUserRole');

//@desc     Get all elements of project 
//@route    GET /api/v1/projects/:projectId/elements/guid/:guid
//@access   Public

exports.getElements= asyncHandler(async (req,res, next)=>{
   
     
        const {projectId, guid} = req.params;
        
        let elements; 

        // const reqQuery={...req.query};

        // //Fields to exclude
        // const removeFields=['select'];
    
        // //Loop over removeFields and delete them from reqQuery
        // removeFields.forEach(param=> delete reqQuery[param])   
        
        //  //Select Fields
        //     if (req.query.select) {
                
        //         const fields = req.query.select.split(',');
                
        //         query.select(fields);
                
        //     }


        if( typeof guid !== 'undefined'){
             
            elements = await RevitElement.find({project:projectId, guid:guid});
        }
        else{  
            
            elements = await RevitElement.find({project: projectId})
        }
       
        res.status(200).json({
            success:true,
            data: elements
        })
   
   
})

//@desc     Create modification
//@route    POST /api/v1/projects/:projectId/elements/guid/:guid
//@access   Public

exports.createElement = asyncHandler(async (req,res, next)=>{
    
    const {projectId, guid} = req.params;
    
    req.body.project = projectId;
    req.body.guid = guid;
    req.body.version = req.body.currentVersion;

   
    const element = await RevitElement.findOneAndUpdate({
        project:projectId,
        guid:guid
    },req.body,{
        new: true,
        upsert: true,
        runValidators: true
    }) 
   
    res.status(200).json({
        success:true,
        data: element
    })


})
