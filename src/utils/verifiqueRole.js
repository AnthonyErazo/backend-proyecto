function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        res.status(403).send('Access forbidden')
    }
}

function isUser(req, res, next) {
    if (req.user && req.user.role === 'user') {
        next()
    } else {
        res.status(403).send('Access forbidden')
    }
}

module.exports = {
    isAdmin,
    isUser
}