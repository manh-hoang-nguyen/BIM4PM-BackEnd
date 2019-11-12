const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name:{
        firstName:{
            type:String,
            required: [true, 'Please add a first name']
        },
        lastName:{
            type:String,
            required: [true, 'Please add a last name']
        }
        
    },
    email:{
        type:String,
        lowercase: true,
        required:[true, 'Please add an email'],
        unique:true,
        match:[
            /^\w+([\.-]?w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    status:{
        type:String,
        enum:['user', 'pro', 'admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true, 'Please add a password'],
        minlength:8,
        select:false
    },
    resetPasswordToken: String,
    resetPasswordExpire:Date 
},{timestamps:true})

//Encrypt password using bcryptjs
UserSchema.pre('save', async function(next){
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    })
}

//Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken =  function(){
    //Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //Set expire
    this.resetPasswordExpire = Date.now() +10*60*1000;

    return resetToken;
}

//Virtual property getter FULLNAME 
// https://mongoosejs.com/docs/guide.html#virtuals
UserSchema.virtual('fullName')
    .get(()=>{return this.name.firstName +  ' ' + this.name.lastName})
    .set((v)=>{
        this.name.firstName = v.substr(0, v.indexOf(' '));
        this.name.lastName = v.substr(v.indexOf(' ') + 1);
    });

module.exports = mongoose.model('User', UserSchema);
