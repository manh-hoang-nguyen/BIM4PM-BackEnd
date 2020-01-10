const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect } = require('../../middleware/auth');
const { getCatAndParameter } = require('../../controllers/frontControllers/Common');

router
    .route('/parametersofcategory')
    .get( getCatAndParameter);

    module.exports = router;