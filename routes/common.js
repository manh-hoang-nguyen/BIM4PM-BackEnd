const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');
const { getCatAndParameter } = require('../controllers/common');

router
    .route('/')
    .get(protect, getCatAndParameter);

    module.exports = router;