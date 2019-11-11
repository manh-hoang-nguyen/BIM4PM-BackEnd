const express = require('express');

const RevitElement = require('../models/RevitElement');


const advancedResults= require('../middleware/advancedResults');

const {protect} = require('../middleware/auth');

const {
    getElements,
    createElement
} = require('../controllers/revitElements')

const { currentVersion} = require('../middleware/currentVersion')

const router = express.Router({mergeParams: true});

router 
    .route('/elements')
    .get(advancedResults(RevitElement),getElements)
    .post(protect, currentVersion, createElement);

module.exports = router;