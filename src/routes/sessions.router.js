const { Router } = require('express');
const passport = require('passport')
const SessionsController = require('../controller/sessions.controller');
const { isAdmin } = require('../middleware/verifiqueRole.middleware.js');
const { extractTokenData } = require('../middleware/extractTokenData.middleware.js')

const {
    register,
    login,
    github,
    githubCallback,
    logout,
    current,
    forgotPassword,
    resetPassword
} = new SessionsController()

const router = Router();

router
    .post('/register', register)
    .post('/login', login)
    .post('/forgot-password',forgotPassword )
    .post('/reset-password/:token',resetPassword )
    .get('/github', passport.authenticate('github', { 
        scope: ['user:email'] 
    }), github)
    .get('/githubcallback', passport.authenticate('github', { 
        session: false, 
        failureRedirect: '/' 
    }), githubCallback)
    .get('/logout',extractTokenData, logout)
    .get('/current', passport.authenticate("jwt", {
        session: false,
        failureRedirect: "/",
    }),isAdmin, current);

module.exports = router;