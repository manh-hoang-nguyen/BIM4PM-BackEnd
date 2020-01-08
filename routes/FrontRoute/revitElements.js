const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect } = require('../../middleware/auth');

const RevitElement = require('../../models/RevitElement');

const {
    getElementsForSchedule
  } = require('../../controllers/frontControllers/revitElement');
  
  router 
      .route('/')
      .get(getElementsForSchedule);
  
  module.exports = router;