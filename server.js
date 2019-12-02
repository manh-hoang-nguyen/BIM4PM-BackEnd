const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan=require('morgan');
const cookieParser = require('cookie-parser')

const connectDB = require('./config/db');
const errorHandler =require('./middleware/errHandler');

//Security
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

//Load env variable
dotenv.config({path: './config/config.env'});

//Connect to Database
connectDB();

const app = express();

//route files
const authRouter = require('./routes/auth');
const projectRouter = require('./routes/projects');
const versionRouter = require('./routes/versions');
const userRouter = require('./routes/users');
const modificationRouter = require('./routes/modifications');
const elementRouter = require('./routes/revitElements');
const commentRouter = require('./routes/comments');

//Body parser 
app.use(express.json({limit: '50mb'}));
//app.use(express.urlencoded({limit: '50mb'}));

//Cookie parser
app.use(cookieParser());

//Dev logging middleware--chi chay o moi truong dev
if(process.env.NODE_ENV==='developement'){
    app.use(morgan('dev'));
}

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate limit
const limiter = rateLimit({
    windowMs:10*60*1000, //10 min ms dc thuc hien request tiep theo
    max:100 //limit to 100
})
app.use(limiter);

//Prevent http param pollution
app.use(hpp());

//Enable CORS
app.use(cors());

//Mount routers
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/versions', versionRouter);
app.use('/api/v1/modifications', modificationRouter);
app.use('/api/v1/', elementRouter);
app.use('/api/v1/comments', commentRouter);

app.use(errorHandler);





const PORT = process.env.PORT||5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}
    `.yellow.bold)
    );

//Handle unhandled promise rejections

process.on('unhandlerRejection',(err,promise)=> {
    console.log(`Error: ${err.message}`.red);

    //close server and exit process

    server.close(()=>process.exit(1));
})