const { Router } = require('express');
const passport = require('passport')
const SessionsController = require('../controller/sessions.controller');

const {
    register,
    login,
    github,
    githubCallback,
    logout,
    current
} = new SessionsController()

const router = Router();

router
    .post('/register', register)
    .post('/login', login)
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
    }), current);

module.exports = router;