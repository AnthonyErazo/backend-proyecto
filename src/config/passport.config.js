const passport = require('passport')
const {usersService} = require('../daos/Mongo')
const { createHash, isValidPassword } = require('../utils/hashPassword.js')
const GithubStrategy = require('passport-github2')

exports.initializePassport = () => {

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.e7d6f54064887e25',
        clientSecret: 'ddb3814b2a5324be76b1a89f122f51f6730774f2',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
        scope: ['user:email'],
    }, async (accesToken, refreshToken, profile, done)=> {
        try {
            let user = await usersService.getUserByMail('anthonyerazo76@gmail.com')
            if (!user) {
                let userNew = {
                    first_name: profile.username,
                    last_name: profile.username,
                    email: !profile._json.email?profile.emails[0].value:profile._json.email,
                    password: createHash('123456')
                }
                let result = await usersService.createUser(userNew)
                return done(null, result)
            }
            done(null, user)

        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done)=>{
        let user = await usersService.geUsertBy({_id: id})
        done(null, user)
    })


}