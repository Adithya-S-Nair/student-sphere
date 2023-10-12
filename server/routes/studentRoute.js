const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const checkAuth = require('../middlewares/chekAuth');

// Define user routes
router.post('/login', studentController.loginStudent);
router.post('/getallstudents',studentController.getAllStudents)
router.get('/getmarks/:id',studentController.getMarks)
router.get('/getuser/:id',studentController.getUser)

module.exports = router;