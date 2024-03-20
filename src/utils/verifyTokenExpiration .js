const jwt = require('jsonwebtoken');

const verifyTokenExpiration = (req, res, next) => {
    const token = req.params.token;
    const options = {
        ignoreExpiration: true,
        algorithms: ['HS256']
    };

    jwt.verify(token, process.env.JWT_SECRET, options, (err, decoded) => {
        if (err) {
            console.error(err);
            res.redirect('/forgotPassword');
        } else {
            next();
        }
    });
};
module.exports=verifyTokenExpiration