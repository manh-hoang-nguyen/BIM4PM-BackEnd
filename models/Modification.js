const mongoose = require('mongoose');

const CommentChildren = require('./children/CommentChildren');

const ModificationSchema = mongoose.Schema({
    project:{
        type:mongoose.Schema.ObjectId,
        ref:'Project',
        required:[true, 'Please add project id']
    },
    guid:{
        type:String,
        required:[true, 'Please add project guid'],
        unique:true
    },
    modifications:[CommentChildren]
})


ModificationSchema.index({project:1,guid:1},{ unique: true}); //indexing 
module.exports = mongoose.model('Modification', ModificationSchema);