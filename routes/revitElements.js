const express = require('express');

const RevitElement = require('../models/RevitElement');


const advancedResults= require('../middleware/advancedResults');

const {protect} = require('../middleware/auth');

const {
    getElementsOfCurrentVersion,
    createElement
} = require('../controllers/revitElements')

const { currentVersion} = require('../middleware/currentVersion')

const router = express.Router({mergeParams: true});

router 
    .route('/elements')
    .get(advancedResults(RevitElement), currentVersion, getElementsOfCurrentVersion)
    .post(protect, currentVersion, createElement);

module.exports = router;