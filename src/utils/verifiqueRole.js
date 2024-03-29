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
function isPremium(req, res, next) {
    if (req.user && req.user.role === 'premium') {
        next();
    } else {
        res.status(403).send('Access forbidden');
    }
}
function isAdminOrPremium(req, res, next) {
    if (req.user && (req.user.role === 'premium'||req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).send('Access forbidden');
    }
}
function isUserOrPremium(req, res, next) {
    if (req.user && (req.user.role === 'premium'||req.user.role === 'user')) {
        next();
    } else {
        res.status(403).send('No tiene permiso para realizar esta acción');
    }
}
module.exports = {
    isAdmin,
    isUser,
    isPremium,
    isAdminOrPremium,
    isUserOrPremium
}