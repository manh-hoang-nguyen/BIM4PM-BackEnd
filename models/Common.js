const mongoose = require('mongoose');

const CommonSchema = mongoose.Schema({
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: [true, 'Please add project id']
    },
    category: Array
});


module.exports = mongoose.model('Common', CommonSchema);