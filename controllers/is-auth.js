const bcrypt = require('bcrypt');
const jsonwt = require('jsonwebtoken');

const User = require('../models/user');


exports.isMatch = async (request, response, next) => {
    const email = request.body.email;
    const password = request.body.password;

    let activeUser;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            response.status(401).json({ message: 'Email does not exist!' });
        }
        activeUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            response.status(401).json({ message: 'Incorrect password!' });
        }
        const token = jsonwt.sign({
            email: activeUser.email,
            userId: activeUser._id.toString()
        },
        'mysecretprivatekey', { expiresIn: '1h' });
        response.status(200).json({ token: token, userId: activeUser._id.toString() });
        
    }
    catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
};