const express = require('express');
const usersController = require('../controllers/users');
const authValid = require('../middleware/authValidation');
const authPermission = require('../middleware/authPermission');

const router = express.Router();


// MY ROUTES 
router.post('/users', usersController.createUser);
router.get('/users', authValid, authPermission.adminPermission, usersController.getUsers);
router.get('/users/:userId', usersController.getUser);
router.patch('/users/:userId', authValid, authPermission.userAndAdminPermission, usersController.patchUser);
router.delete('/users/:userId',authValid, authPermission.adminPermission, usersController.deleteUser);



module.exports = router;