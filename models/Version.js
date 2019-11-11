const mongoose = require('mongoose');

const Comparision = require('./RevitElement');

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

VersionSchema.index({project:1}); //indexing  
module.exports =mongoose.model('Version',VersionSchema);