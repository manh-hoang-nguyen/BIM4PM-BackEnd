const express = require('express');

const RevitElement = require('../models/RevitElement');


const advancedResults= require('../middleware/advancedResults');

const {protect} = require('../middleware/auth');

const {
    getElementsOfVersion,
    createElement,
    createElements
} = require('../controllers/revitElements')

const { currentVersion} = require('../middleware/currentVersion')

const router = express.Router({mergeParams: true});

router 
    .route('/')
    .get(currentVersion, getElementsOfVersion)
    .post(protect, currentVersion, createElements);

module.exports = router;