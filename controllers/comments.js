const asyncHandler = require('../middleware/asyncHandler');
const Comment = require('../models/Comment');
const Project = require('../models/Project');
const CheckUserRole = require('../utils/checkUserRole');

//@desc     Get all comment of project 
//@route    GET /api/v1/projects/:projectId/comments/guid/:guid
//@access   Public

exports.getComments= asyncHandler(async (req,res, next)=>{
   
     
        const {projectId, guid} = req.params;
        
        let comments; 
        
        if( typeof guid !== 'undefined'){
             
            comments = await Comment.find({project:projectId, guid:guid});
        }
        else{ 

            comments = await Comment.find({project: projectId})
        }
       
        res.status(200).json({
            success:true,
            data: comments
        })
   
   
})

//@desc     Create comment
//@route    POST /api/v1/projects/:projectId/comments/guid/:guid
//@access   Public

exports.createComment = asyncHandler(async (req,res, next)=>{
    
    const {projectId, guid} = req.params;
    
    req.body.project = projectId;
    req.body.guid = guid;
    req.body.createdBy = req.user.id;
    
    const options={
        $push:{
            comments: req.body}
    }
   
    const comment = await Comment.findOneAndUpdate({
        project:projectId,
        guid:guid
    },options,{
        new: true, 
        runValidators: true
    }) 
   
    res.status(200).json({
        success:true,
        data: comment
    })


})

//@desc     Update comment
//@route    PUT /api/v1/projects/:projectId/guid/:guid/comments/:id
//@access   Private

exports.updateComment = asyncHandler(async (req,res, next)=>{
    
    const {projectId, guid, id} = req.params; 
     

    const option = {
        $set:{
            'comments.$.text' : req.body.text,
            'comments.$.updatedAt': Date.now()
        }
    }

    const comment = await Comment.findOneAndUpdate({
        project:projectId,
        guid: guid,
        'comments._id':id
    },option,{
        new: true,
        runValidators: true
    })
 
    res.status(200).json({
        success:true,
        data: comment
    }) 
})

//@desc     Delete comment
//@route    DELETE /api/v1/projects/:projectId/guid/:guid/comments/:id
//@access   Private

exports.deleteComment = asyncHandler(async (req,res, next)=>{
    
    const {projectId, guid, id} = req.params; 

  
    //  //Make sure user is project owner
    //  if (project.owner.toString() !==req.user.id && req.user.status !=='admin') {
    //     return next(new ErrorResponse(`User ${req.user.id } is not authorized to update this project`,401));
    // }
    
  
    const option ={
        $pull:{
            comments:{_id:id}
        }
    }
    const comment = await Comment.findOneAndUpdate({
        project:projectId,
        guid: guid,
        'comments._id':id
    },option,{
        new: true
    });
 
    res.status(200).json({
        success:true,
        data: comment
    }) 
})