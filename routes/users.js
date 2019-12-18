const express = require('express');
const usersController = require('../controllers/users');
const authValid = require('../middleware/authValidation');
const authPermission = require('../middleware/authPermission');
const { body } = require('express-validator');

const router = express.Router();
const User = require('../models/user');



// MY ROUTES 
router.post('/users', [
    body('firstName').trim().isLength({ min: 5 }),
    body('lastName').trim().isLength({ min: 5 }),
    body('email')
        .isEmail()
        .withMessage('Email not valid...')
        .custom((value, {  request }) => {
            return User.findOne({ email: value }).then(userDocument => {
                if (userDocument) {
                    return Promise.reject('Email already exists!');
                }
            });
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 })
], usersController.createUser);

router.get('/users', authValid, authPermission.adminPermission, usersController.getUsers);

router.get('/users/:userId', usersController.getUser);

router.patch('/users/:userId', [
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 5 }),
    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 5 }),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email')
        .custom((value, { request }) => {
            return User.findOne({ email: value }).then(userDocument => {
                if (userDocument) {
                    return Promise.reject('Email already exists!');
                }
            });
        })
        .normalizeEmail(),
    body('password')
        .optional()
        .trim()
        .isLength({ min: 5 })  
], authValid, authPermission.userAndAdminPermission, usersController.patchUser);

router.delete('/users/:userId',authValid, authPermission.adminPermission, usersController.deleteUser);



module.exports = router;