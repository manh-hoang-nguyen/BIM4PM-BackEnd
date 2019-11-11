const mongoose = require('mongoose');

const CommentChilrenSchema = mongoose.Schema({
    version:{
        type:mongoose.Schema.ObjectId,
        ref:'Version',
        required:[true, 'Please define the version']
    },
    text:{
        type:String,
        required:[true, 'Please add a comment']
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
})
 

module.exports = CommentChilrenSchema;