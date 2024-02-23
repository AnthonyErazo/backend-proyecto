const { configObject } = require('../config');
const jwt = require('jsonwebtoken')
exports.extractTokenData = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        req.user=null
        next()
    }
    try {
        const decoded = jwt.verify(token, configObject.Jwt_private_key);
        req.user=decoded
        next()
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
    }
    
};