const Project = require('../models/Project');
const ErrorResponse = require('./errorReponse')

const checkRole = async (projectId,req, next) =>{
    const project = await Project.findById(projectId);
    
    if(!project){
        return next(new ErrorResponse(`Project not found with id of ${projectId}`,404));
      }
    
     //Make sure user is project owner
     if (project.owner.toString() !==req.user.id && req.user.status !=='admin') {
        //If user role is administrator
        let userRole;
        
        project.members.forEach(member => { 
            if(member.user.toString()===req.user.id) {
                userRole=member.role
            }  
        }); 
        

        if(!userRole || userRole!=='administrator'){
            return next(new ErrorResponse(`User ${req.user.email } is not authorized to this route`,401));
        }
        else{
            return next ( new ErrorResponse(`User ${req.user.email } is not in this project`,401));
        }
        
       
    }
}

module.exports = checkRole;