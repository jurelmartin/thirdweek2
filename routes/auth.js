const express = require('express');
const authController = require('../controllers/is-auth');

const router = express.Router();




router.post('/login', authController.isMatch);

module.exports = router;