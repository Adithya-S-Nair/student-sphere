const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const checkAuth = require('../middlewares/chekAuth');

// Define user routes
router.post('/getallstudents',studentController.getAllStudents)

module.exports = router;