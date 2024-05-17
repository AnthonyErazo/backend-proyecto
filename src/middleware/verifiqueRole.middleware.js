exports.isAdmin=(req, res, next)=>{
    if (req.user&&req.user.role === 'admin') {
        next()
    } else {
        res.status(403).send('Access forbidden')
    }
}

exports.isUser=(req, res, next)=>{
    if (req.user&&req.user.role === 'user') {
        next()
    } else {
        res.status(403).send('Access forbidden')
    }
}

exports.isPremium=(req, res, next)=>{
    if (req.user&&req.user.role === 'premium') {
        next();
    } else {
        res.status(403).send('Access forbidden');
    }
}
exports.isAdminOrPremium=(req, res, next)=>{
    if (req.user&&(req.user.role === 'premium'||req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).send('Access forbidden');
    }
}

exports.isUserOrPremium=(req, res, next)=>{
    if (req.user&&(req.user.role=== 'premium'||req.user.role === 'user')) {
        next();
    } else {
        res.status(403).send('Access forbidden');
    }
}