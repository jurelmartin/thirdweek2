const express = require('express');
const authController = require('../controllers/is-auth');
const { body } = require('express-validator');


const router = express.Router();
const User = require('../models/user');





router.post('/login', authController.isMatch);

module.exports = router;