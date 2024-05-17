const jwt = require('jsonwebtoken')
const { configObject } = require('../config/configObject');

const JWT_PRIVATE_KEY = configObject.Jwt_private_key

const createToken = user => jwt.sign(user, JWT_PRIVATE_KEY, {expiresIn: '1d'})

const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) res.status(401).json({stauts: 'error', error: 'not authenticated'})

    const token = authHeader.split(' ')[1]
    jwt.verify(token, JWT_PRIVATE_KEY, (err, userDecode)=>{
        if(err) return res.status(401).json({status: 'error', error: 'not authorized'})
        req.user = userDecode
        next()
    })
}

module.exports = {
    createToken,
    authenticationToken,
    JWT_PRIVATE_KEY
}