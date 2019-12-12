const express = require('express');

const RevitElement = require('../models/RevitElement');

const advancedResults = require('../middleware/advancedResults');

const { protect } = require('../middleware/auth');

const {
  getElementsOfVersion,
  createElement,
  createElements,
  deleteElements,
  updateElements,
  deleteAllForTest,
  getHistory
} = require('../controllers/revitElements');

const { currentVersion } = require('../middleware/currentVersion');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(currentVersion, getElementsOfVersion)
  .post(protect, currentVersion, createElements)
  .delete(protect, currentVersion, deleteElements)
  .put(protect, currentVersion, updateElements);
router.route('/history').get(protect, currentVersion, getHistory);
router.route('/deleteAll').delete(deleteAllForTest);
module.exports = router;
