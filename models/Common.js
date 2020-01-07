const mongoose = require('mongoose');

const CommonSchema = mongoose.Schema({
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: [true, 'Please add project id'],
        unique: true
    },
    category: Array
});


module.exports = mongoose.model('Common', CommonSchema);