const express = require('express');
const usersController = require('../controllers/users');

const router = express.Router();


// MY ROUTES 
router.post('/users', usersController.createUser);
router.get('/users', usersController.getUsers);
router.get('/users/:userId', usersController.getUser);
router.patch('/users/:userId', usersController.patchUser);
router.delete('/users/:userId', usersController.deleteUser);



module.exports = router;