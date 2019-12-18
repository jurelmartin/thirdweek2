const jsonwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    const authHeader = request.get('Authorization');
    if (!authHeader) {
        response.status(401).json({ message: 'Not Authenticated' });
    }

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
    request.userId = decodedToken.userId;
    request.permissionLevel = decodedToken.permissionLevel;
    next();
}