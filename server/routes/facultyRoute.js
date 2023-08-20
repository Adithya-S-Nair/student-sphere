const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const checkAuth = require('../middlewares/chekAuth');

// Define user routes
router.post('/login', facultyController.loginFaculty);
router.post('/registerfaculty', checkAuth, facultyController.registerFaculty);

module.exports = router;