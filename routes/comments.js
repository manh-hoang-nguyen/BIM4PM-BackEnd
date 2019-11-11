const express = require('express');

const Comment = require('../models/Comment');

const {protect} = require('../middleware/auth')

const {
getComments,
createComment,
updateComment,
deleteComment

} = require('../controllers/comments');

const router = express.Router({mergeParams: true});

router
    .route('/comments(/:id)?')
    .get(getComments)
    .post(protect, createComment)
    .put(protect, updateComment)
    .delete(protect, deleteComment);

module.exports = router;