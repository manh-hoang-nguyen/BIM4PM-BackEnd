const fs=require('fs');
const mongoose=require('mongoose');
const colors=require('colors');
const dotenv=require('dotenv');

//Load env variables
dotenv.config({path:'./config/config.env'});

//Load models
const Project=require('./models/Project');
const User = require('./models/User');
const Modification = require('./models/Modification');
const Version = require('./models/Version');
const RevitElement = require('./models/RevitElement');
 const Comment = require('./models/Comment');

//Connect to DB
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true 
});

//Read JSON files
const projects=JSON.parse(fs.readFileSync(`${__dirname}/_data/projects.json`,'utf-8'));
const users=JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'));
const modifications=JSON.parse(fs.readFileSync(`${__dirname}/_data/modifications.json`,'utf-8'));
const versions=JSON.parse(fs.readFileSync(`${__dirname}/_data/versions.json`,'utf-8'));
const revitElements=JSON.parse(fs.readFileSync(`${__dirname}/_data/revitElements.json`,'utf-8'));
const comments=JSON.parse(fs.readFileSync(`${__dirname}/_data/comments.json`,'utf-8'));
 

//Import into DB
const importData=async()=>{
    try {
        await Project.create(projects);
        await User.create(users);
        await Modification.create(modifications);
        //await Version.create(versions);
        await RevitElement.create(revitElements);
        await Comment.create(comments);
        console.log('Data imported...'.green.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

//Delete data
const deleteData=async()=>{
    try {
        await Project.deleteMany();
        await User.deleteMany();
        await Modification.deleteMany();
        await Version.deleteMany();
        await RevitElement.deleteMany();
        await Comment.deleteMany();
        
        console.log('Data destroyed...'.red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

if(process.argv[2]==='-i'){
    importData();
}else if(process.argv[2]=='-d'){
    deleteData();
}