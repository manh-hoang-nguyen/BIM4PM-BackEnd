const express = require('express');

const advancedResults= require('../middleware/advancedResults');

const {protect} = require('../middleware/auth')

const Version = require('../models/Version');

const {
    getVersions,
    getCurrentVersion,
    createVersion,
    deleteProjectVersion
} = require('../controllers/versions')

const router = express.Router({mergeParams: true});

router
    .route('/')
    .get(advancedResults(Version),getVersions)
    .post(protect, createVersion)
    .delete(protect, deleteProjectVersion);

router
    .route('/current')
    .get(getCurrentVersion)

module.exports = router;