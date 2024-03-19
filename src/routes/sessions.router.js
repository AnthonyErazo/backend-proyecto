const { Router } = require('express');
const passport = require('passport')
const SessionsController = require('../controller/sessions.controller');
const { authentication } = require('../middleware/auth.middleware');
const { isAdmin } = require('../utils/verifiqueRole');

const {
    register,
    login,
    github,
    githubCallback,
    logout,
    current,
    forgotPassword
} = new SessionsController()

const router = Router();

router
    .post('/register', register)
    .post('/login', login)
    .post('/forgot-password',forgotPassword )
    .get('/github', passport.authenticate('github', { 
        scope: ['user:email'] 
    }), github)
    .get('/githubcallback', passport.authenticate('github', { 
        session: false, 
        failureRedirect: '/' 
    }), githubCallback)
    .get('/logout', logout)
    .get('/current', passport.authenticate("jwt", {
        session: false,
        failureRedirect: "/",
    }),isAdmin, current);

module.exports = router;