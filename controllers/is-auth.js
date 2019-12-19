const bcrypt = require('bcryptjs');
const jsonwt = require('jsonwebtoken');

const User = require('../models/user');

let tokenRecords = {};


exports.isMatch = async (request, response, next) => {

    const email = request.body.email;
    const password = request.body.password;

    let activeUser;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return response.status(401).json({ message: 'Email does not exist!' });
        }
        activeUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            return response.status(401).json({ message: 'Incorrect password!' });
        }
        // ACCESS TOKEN
        const token = jsonwt.sign({
            email: activeUser.email,
            userId: activeUser._id.toString(),
            permissionLevel: activeUser.permissionLevel

        },
        'mysecretprivatekey', { expiresIn: '1h' });
        // REFRESH TOKEN
        const refreshToken = jsonwt.sign({
            email: activeUser.email,
            userId: activeUser._id.toString(),
            permissionLevel: activeUser.permissionLevel
        },
        'mysecretprivaterefreshkey', { expiresIn: '24hr' });

        const loginResponse = {
            "token": token,
            "refreshToken": refreshToken
        }

        tokenRecords[refreshToken] = loginResponse;
        response.status(200).json(tokenRecords[refreshToken]);
        
    }
    catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
};

exports.newToken =  async (request, response, next) => {
    const bodyData = request.body;
    const email = request.body.email;

    let activeUser;

    try {
        const findUser = await User.findOne({ email: email });
        activeUser = findUser;

        if((bodyData.refreshToken) && (bodyData.refreshToken in tokenRecords)) {
        const token =  jsonwt.sign({
            email: activeUser.email,
            userId: activeUser._id.toString(),
            permissionLevel: activeUser.permissionLevel
        },
        'mysecretprivatekey', { expiresIn: '1h' });
        const changeResponse = {
            "token": token
        }
        tokenRecords[bodyData.refreshToken].token = token;
        response.status(200).json(changeResponse);
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

