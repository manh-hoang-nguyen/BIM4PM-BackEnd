const mongoose = require('mongoose');

const PointSchema = mongoose.Schema({
    X:{
        type:Number,
        required:true
    },
    Y:{
        type:Number,
        required:true
    },
    Z:{
        type:Number,
        required:true
    }
})

module.exports = PointSchema;