const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"

        if (!token) {
            return res.status(401).json({message: 'Нет авторизации'})
        }
        const decoded = jwt.verify(token, config.get('jwtSecret'))

        req.user = decoded
        next()
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            return res.status(401).json({type: 'TokenExpiredError', message: 'Время действия токена истекло'})
        }
        return res.status(401).json({message: 'Нет авторизации'})
    }
}