const express = require('express');
const advancedResults= require('../middleware/advancedResults');

const {protect} = require('../middleware/auth');

const Modification = require('../models/Modification');

const {
    getModifications,
    createModification
} = require('../controllers/modifications')

const { currentVersion} = require('../middleware/currentVersion')

const router = express.Router({mergeParams: true});

router
    .route('(/guid/:guid)?')
    .get(getModifications)
    .post(protect, currentVersion, createModification);

 

module.exports = router;