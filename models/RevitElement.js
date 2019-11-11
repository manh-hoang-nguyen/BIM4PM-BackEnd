const mongoose = require('mongoose');
 
const Point = require('./children/Point');

const RevitElementSchema = mongoose.Schema({
    project:{
        type:mongoose.Schema.ObjectId,
        ref:'Project',
        required:[true, 'Please add project id']
    },
    guid:{
        type:String,
        required:[true, 'Please add project guid']
    },
    version:{
        type:mongoose.Schema.ObjectId,
        ref:'Version',
        required:[true, 'Please define the version']
    },
    
    location:[Point],
    boundingBox:[Point],
    centroid:Point,
    typeId:String,
    volume:Number,
    properties:{
        type:Object     
    }
    
    
},{timestamps:true})


RevitElementSchema.index({project:1, guid:1, version:1}, { unique: true }); //indexing 
module.exports = mongoose.model('RevitElement', RevitElementSchema);