const jsonwt = require('jsonwebtoken');

const requiredPermissionLevel = 1;

exports.adminPermission = (request, response, next) => {
    const authHeader = request.get('Authorization');
    const token = request.get('Authorization').split(' ')[1];

    let decodedToken;
    try {
        decodedToken = jsonwt.verify(token, 'mysecretprivatekey');
    }
    catch (err) {
        response.status(500).json({ message: 'Invalid token' });
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        response.status(401).json({ message: 'Not Authenticated' });
    }

    let activeUserPermissionLevel = decodedToken.permissionLevel;
    if (activeUserPermissionLevel !== requiredPermissionLevel) {
        response.status(403).json({ message: 'Admin only!' });
    }
    next();
    
};

exports.userAndAdminPermission = (request, response, next) => {
    const token = request.get('Authorization').split(' ')[1];

    let decodedToken;
    try {
        decodedToken = jsonwt.verify(token, 'mysecretprivatekey');
    }
    catch (err) {
        response.status(500).json({ message: 'Invalid token' });
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        response.status(401).json({ message: 'Not Authenticated' });
    }

    let activeUserPermissionLevel = decodedToken.permissionLevel;
    let userId = decodedToken.userId;
    

    if (request.params && request.params.userId && userId === request.params.userId) {
        //response.status(200).json({ message: 'Updated successfully!' });
         next();
    }
    else {
        if (activeUserPermissionLevel && requiredPermissionLevel) {
            //response.status(200).json({ message: 'Updated successfully!' });
             next();
        } 
        else {
            //response.status(200).json({ message: 'Updated successfully!' });
             next();
        }
    }

  
}