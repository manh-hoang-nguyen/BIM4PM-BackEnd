const mongoose = require('mongoose');
 
const ProjectSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'please add a name'],
        unique:true, 
        maxlength:[50,'Name can not more than 50 charecters']

    },
    description:{
        type:String,
        required:[true,'please add a description'], 
        maxlength:[500,'Description can not more than 500 charecters'] 
    },
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    members:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true
        },
        role:{
            type:String,
            required:[true, 'Please define the role of member'],
            enum:[ 'administrator', 'member']
        }
    }]
},{
    timestamps:true,
    toJSON: {virtuals:true},
    toObject: { virtuals:true}
});



//Cascade delete Modification, Element, Comment when Project is deleted
ProjectSchema.pre('remove', true, async function(next){
    console.log(`Modifications, Elements, Comments, Versions being removed from projects ${this._id}`);
    await this.model('Version').deleteMany({project:this._id});
    await this.model('Modification').deleteMany({project:this._id});
    await this.model('RevitElement').deleteMany({project:this._id});
    await this.model('Comment').deleteMany({project:this._id});
    next();
})

ProjectSchema.pre('save', true, async function(next){
    await this.model('Version').create({project: this._id})
    next();
})
//reverse polulate with virtuals
ProjectSchema.virtual('versions',{
    ref:'Version',
    localField:'_id',
    foreignField:'project',
    justOne:false
})

module.exports =mongoose.model('Project', ProjectSchema) ;
