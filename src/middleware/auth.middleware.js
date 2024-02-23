exports.authentication = async (req, res, next) => {
    if (req.user) {
        if (req.user.role === 'admin' || req.user.role === 'user') {
            next(); 
        } else {
            res.status(403).send('Access forbidden');
        }
    } else {
        res.redirect('/login');
    }
    
};

