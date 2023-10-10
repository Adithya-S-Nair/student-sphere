const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const checkAuth = require('../middlewares/chekAuth');

// Define user routes
router.post('/login', facultyController.loginFaculty);
router.post('/registerfaculty', checkAuth, facultyController.registerFaculty);
router.post('/newbatch', facultyController.createNewBatch);
router.post('/markattendance', checkAuth, facultyController.markAttendance);
router.post('/entermark', checkAuth, facultyController.enterMark);
router.post('/addsubject', checkAuth, facultyController.addSubject);
router.get('/getallbatch', facultyController.getAllBatch);
router.get('/getallfaculty', facultyController.getAllFaculty);
router.get('/getallsubjects', facultyController.getAllSubjects);

module.exports = router;