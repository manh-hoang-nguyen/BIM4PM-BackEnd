const express = require('express');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

const  {
createTopic,
getTopics,
addComment
} = require('./../controllers/topics');


router
    .route('/')
    .get(protect, createTopic)
    .post(protect, createTopic);

router
    .route('/:topicId')
    .post(protect, addComment);

module.exports = router;
