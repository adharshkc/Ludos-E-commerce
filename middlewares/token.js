const jwt = require('jsonwebtoken')
const { logger } = require('../utils/logger')

const secretKey = process.env.JWT_SECRET

const generateToken = function(email){
    return jwt.sign({email}, secretKey, {expiresIn: '1d'})
}

const verifyToken = function(token){
    try {
        return jwt.verify(token, secretKey)
    } catch (error) {
        logger.error({message: `invalid token ${error}`})
        return null
    }
}

module.exports = {generateToken, verifyToken}