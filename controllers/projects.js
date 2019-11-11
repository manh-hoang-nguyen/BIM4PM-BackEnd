const ErrorResponse =require('../utils/errorReponse');
const asyncHandler = require('../middleware/asyncHandler');
const Project = require('../models/Project');
const User = require('../models/User');

//@desc     Get all projects
//@route    GET /api/v1/projects
//@access   Public

exports.getProjects = asyncHandler(async (req,res, next)=>{
     
    res 
        .status(200)
        .json( res.advancedResults) ;
})


//@desc     Get all user's projects
//@route    GET /api/v1/projects
//@access   Public

exports.getUserProjects = asyncHandler(async (req,res, next)=>{
     
    const projects = await Project.find({owner: req.user.id});
    res 
        .status(200)
        .json({
            success: true,
            data: projects
        }) ;
})

//@desc     Get  project
//@route    GET /api/v1/projects/:id
//@access   Public

exports.getProject = asyncHandler(async (req,res, next)=>{
    
    const project = await Project.findById(req.params.id);

    
    if(!project){
        return next(new ErrorResponse(`Project not found with id of ${req.params.id}`,404));
      }

      res.status(200)
      .json({succes:true,data:project});
    
})

//@desc     Create  project
//@route    POST /api/v1/projects
//@access   Private

exports.createProject = asyncHandler(async (req, res, next)=>{
    req.body.owner = req.user.id;

    //Check for created project
    const createdProject = await Project.findOne({owner: req.user.id});

    //If the user status is not an admin or pro, the can only add one project
    if (createdProject && req.user.status !=='admin'&& req.user.status !=='pro') {
        return next(new ErrorResponse(`The user with Id ${req.user.id} has already created a project`, 403))
    }   
    const project =  await Project.create(req.body);
        res.status(200)
           .json({
            succes:true,
            data:project
        })
})

//@desc     Update  project
//@route    UPDATE /api/v1/projects/:id
//@access   Private
exports.updateProject = asyncHandler(async (req, res, next)=>{

    let project = await Project.findById(req.params.id);

    if(!project){
        return next(ErrorResponse(`Project not found with id of ${req.params.id}`, 404))
    }

     //Make sure user is project owner
     if (project.owner.toString() !==req.user.id && req.user.status !=='admin') {
        return next(new ErrorResponse(`User ${req.user.id } is not authorized to update this project`,401));
    }
    
    project = await Project.findOneAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true
    })

    res.status(200).json({success:true, data:project}); 
})

//@desc     Delete  project
//@route    DELETE /api/v1/projects/:id
//@access   Private
exports.deleteProject = asyncHandler(async (req, res, next)=>{

    let project = await Project.findById(req.params.id);

    if(!project){
        return next(ErrorResponse(`Project not found with id of ${req.params.id}`, 404))
    }

     //Make sure user is project owner
     if (project.owner.toString() !==req.user.id && req.user.status !=='admin') {
        return next(new ErrorResponse(`User ${req.user.id } is not authorized to delete this project`,401));
    }
    
    project.remove();
    res.status(200).json({success:true, data:{}}); 
})

//@desc     Add  project members
//@route    PUT /api/v1/projects/:id/addmember
//@access   Private
exports.addMember = asyncHandler(async (req, res, next)=>{

    let project = await Project.findById(req.params.id);
    const memberToAdd = await User.findOne({email:req.body.email});

    if(!memberToAdd){
        return next(new ErrorResponse(`User ${req.body.email} is not registerd yet`, 400));
    }

    if(!project){
        return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404))
    }
    
    //Make sure user is project owner
    if (project.owner.toString() !==req.user.id && req.user.status !=='admin') {
        //If user role is administrator
        let userRole;
        let checkUser;
        project.members.forEach(member => {
            
            //Check if user to add is in project already
            if(memberToAdd.id==member.user){
                checkUser = true; 
            }

            if(member.user.toString()===req.user.id) {
                userRole=member.role
            }  
        }); 

        if(!userRole || userRole!=='administrator')
        return next(new ErrorResponse(`User ${req.user.email } is not authorized to update this project`,401));
        
        if(checkUser) return next(new ErrorResponse(`User ${memberToAdd.email } is in this project already`,401));
    }
    
    let objPush = {
        $push:{
            members:{
                user: memberToAdd.id,
                role: req.body.role
            }
        }
    }

     project = await Project.findOneAndUpdate(req.params.id, objPush, {
         new:true,
         runValidators:true
    })

    res.status(200).json({success:true, data:project}); 
})

//@desc     Remove  member from project 
//@route    PUT /api/v1/projects/:id/removemember
//@access   Private
exports.removeMember = asyncHandler(async (req, res, next)=>{

    let project = await Project.findById(req.params.id);
    const memberToRemove = await User.findOne({email:req.body.email});

    if(!memberToRemove){
        return next(new ErrorResponse(`User ${req.body.email} is not registerd yet`, 400));
    }

    if(!project){
        return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404))
    }
    
    //Make sure user is project owner
    if (project.owner.toString() !==req.user.id && req.user.status !=='admin') {
        //If user role is administrator
        let userRole = false;
        let checkUser;
        project.members.forEach(member => {
            
            //Check if user to add is in project already
            if(memberToRemove.id==member.user){
                checkUser = true; 
            }

            if(member.user.toString()===req.user.id) {
                userRole=member.role
            }  
        });
        
        if(!userRole || userRole!=='administrator')
        return next(new ErrorResponse(`User ${req.user.email } is not authorized to update this project`,401));

        if(!checkUser) return next(new ErrorResponse(`User ${memberToRemove.email } is not in this project`,401));
    }
    
    let objRemove = {
        $pull:{
            members:{
                user: memberToRemove.id 
            }
        }
    }

     project = await Project.findOneAndUpdate(req.params.id, objRemove, {
         new:true,
         runValidators:true
    })

    res.status(200).json({success:true, data:project}); 
})