const mongoose = require('mongoose');
 

const VersionSchema = mongoose.Schema({
    project:{
        type:mongoose.Schema.ObjectId,
        ref:'Project',
        required:[true, 'Please add project id'],
        unique: true
    },
    versions:[{
        version:{
            type:Number,
            required:[true, 'Please define the version'],
            unique: [true, 'Please add another version']
        }, 
        description:{
            type:String,
            required:[true, 'Please add a description']
        },
        createdBy:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true
        },
        createdAt:{
            type:Date,
            default:Date.now
        }

    }]
   
},{timestamps:true})

VersionSchema.statics.findByVersion = function(projectId, version, callback){
     
     this.findOne({project: projectId}, function(err, items){
         
        items.versions.forEach(item=>{
       
           if (item.version==version) { 
               
               return (item, callback);
            }    
       })
    })
   
     
}

VersionSchema.index({project:1}); //indexing  
module.exports =mongoose.model('Version',VersionSchema);