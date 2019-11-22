const express = require('express');

const advancedResults= require('../middleware/advancedResults');

const Project = require('../models/Project'); 
 
const {
    getProjects,
    getUserProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    addMember,
    removeMember
} = require('../controllers/projects')

const {protect} = require('../middleware/auth')

//Include other resource routers
const versionRouter = require('./versions');
const modificationRouter = require('./modifications');
const elementRouter = require('./revitElements');
const commentRouter = require('./comments');

const router = express.Router();

//Re-route into other resource routers
router.use('/:projectId/versions', versionRouter);
router.use('/:projectId/modifications', modificationRouter);
router.use('/:projectId/guid/:guid/elements', elementRouter);
router.use('/:projectId/elements', elementRouter);
router.use('/:projectId/guid/:guid', commentRouter);


router
    .route('/')
    .get(protect, getUserProjects)
    .post(protect, createProject);

router 
    .route('/all')
    .get(advancedResults(Project,'versions'), getProjects)
router
    .route('/:id')
    .get(protect, getProject)
    .put(protect, updateProject)
    .delete(protect, deleteProject);

router
    .route('/:id/addmember')
    .put(protect, addMember);
router
    .route('/:id/removemember')
    .put(protect, removeMember);

module.exports = router;