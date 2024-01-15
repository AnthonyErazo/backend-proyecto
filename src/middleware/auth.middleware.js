const { usersModel } = require('../daos/Mongo/models/user.model');

exports.authentication = async (req, res, next) => {
    if (req.session?.user?.email === 'adminCoder@coder.com') {
        next()
    }else{
        const userFound = await usersModel.findOne({
            email: req.session?.user?.email,
        });
    
        if (!userFound) {
            return res.redirect('/');
        }
        next();
    }
    
};