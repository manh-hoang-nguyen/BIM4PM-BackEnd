const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const Comment = require('../models/Comment');
const ErrorResponse =require('../utils/errorReponse');
const CheckUserRole = require('../utils/checkUserRole');

//@desc     Get all comment of project 
//@route    GET /api/v1/projects/:projectId/comments/guid/:guid
//@access   Public

exports.getComments = asyncHandler(async (req, res, next) => {

    const {
        projectId,
        guid
    } = req.params;

    let comments;

    if (typeof guid !== 'undefined') {

        comments = await Comment.findOne({
            project: projectId,
            guid: guid
        }).select('comments').populate({
            path: 'comments.user',
            select: 'name'
        });
    } else {

        comments = await Comment.find({
            project: projectId
        })
    }

    res.status(200).json({
        success: true,
        data: comments
    })


})

//@desc     Create comment
//@route    POST /api/v1/projects/:projectId/comments/guid/:guid
//@access   Public

exports.createComment = asyncHandler(async (req, res, next) => {
    const _id = mongoose.Types.ObjectId();
    const {
        projectId,
        guid
    } = req.params;
    if(req.body.text==""){
        next(new ErrorResponse("Text can not be empty", 400));
    }
    req.body.project = projectId;
    req.body.guid = guid;
    req.body.user = req.user.id;
    req.body._id = _id;
    const options = {
        $push: {
            comments: req.body
        }
    }

    const comments = await Comment.findOneAndUpdate({
        project: projectId,
        guid: guid
    }, options, {
        new: true,
        upsert: true,
        runValidators: true
    })

    const comment = comments.comments.id(_id);
    const data = {
        _id: comment._id,
        type: comment.type,
        createdAt: comment.createdAt,
        text: comment.text,
        user: {
            name: req.user.name,
            _id: req.user._id
        }
    }

    res.status(200).json({
        success: true,
        data: data
    })


})

//@desc     Update comment
//@route    PUT /api/v1/projects/:projectId/guid/:guid/comments/:id
//@access   Private

exports.updateComment = asyncHandler(async (req, res, next) => {

    const {
        projectId,
        guid,
        id
    } = req.params;

    const option = {
        $set: {
            'comments.$.text': req.body.text,
            'comments.$.updatedAt': Date.now()
        }
    }

    const comment = await Comment.findOneAndUpdate({
        project: projectId,
        guid: guid,
        'comments._id': id
    }, option, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: comment
    })
})

//@desc     Delete comment
//@route    DELETE /api/v1/projects/:projectId/guid/:guid/comments/:id
//@access   Private

exports.deleteComment = asyncHandler(async (req, res, next) => {

    const {
        projectId,
        guid,
        id
    } = req.params;


    //  //Make sure user is project owner
    //  if (project.owner.toString() !==req.user.id && req.user.status !=='admin') {
    //     return next(new ErrorResponse(`User ${req.user.id } is not authorized to update this project`,401));
    // }


    const option = {
        $pull: {
            comments: {
                _id: id
            }
        }
    }
    const comment = await Comment.findOneAndUpdate({
        project: projectId,
        guid: guid,
        'comments._id': id
    }, option, {
        new: true
    });

    res.status(200).json({
        success: true,
        data: comment
    })
})