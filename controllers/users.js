const ErrorResponse =require('../utils/errorReponse');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');

//@desc     Get  all users
//@route    GET /api/v1/auth/users 
//@access   Private/Admin

exports.getUsers = asyncHandler(async(req, res, next)=>{

    //const users = await User.find();

    res.status(200).json(res.advancedResults);

})

//@desc     Create user
//@route    POST /api/v1/auth/users
//@access   Private/Admin

exports.createUser = asyncHandler(async(req, res, next)=>{

    const user = await User.create(req.body);

    res.status(201).json({
        success:true,
        data:user
    });

});
