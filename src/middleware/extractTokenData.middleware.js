const { configObject } = require('../config/configObject');
const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');
exports.extractTokenData = (req, res, next) => {
    const token = res.req.cookies.token;
    if (!token) {
        req.user=null
        next()
    }
    try {
        const decoded =jwt.verify(token, configObject.Jwt_private_key);
        req.user=decoded
        next()
    } catch (error) {
        logger.error('Error al verificar el token:', error.message );
    }
    
};