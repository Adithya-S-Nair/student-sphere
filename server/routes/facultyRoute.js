const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const checkAuth = require('../middlewares/chekAuth');

// Define user routes
router.post('/login', facultyController.loginFaculty);
router.post('/registerfaculty', checkAuth, facultyController.registerFaculty);
router.post('/newbatch', checkAuth, facultyController.createNewBatch);
router.post('/markattendance', checkAuth, facultyController.markAttendance);

module.exports = router;