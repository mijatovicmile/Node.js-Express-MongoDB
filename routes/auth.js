const express = require('express');
const router = express.Router();

// Controller for authentication
const authController = require('../controllers/auth');

// Route to the login page - GET method
router.get('/login', authController.getLogin);

// Login page - POST method
router.post('/login', authController.postLogin);

// User logout
router.post('/logout', authController.postLogout);

// Signup route - GET method
router.get('/signup', authController.getSignup);

// Signup route - POST method
router.post('/signup', authController.postSignup);
 
// Exports the auth module
module.exports = router;