const passport = require('passport')
const passport_jwt = require('passport-jwt')

const {usersService} = require('../daos/Mongo')
const GithubStrategy = require('passport-github2')

const JWTStrategy = passport_jwt.Strategy
const ExtractJWT  = passport_jwt.ExtractJwt

exports.initializePassport = () => {

    const cookieExtractor = req => {
        let token = null
        if (req && req.cookies) {
            token = req.cookies['token']
        }
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: 'palabrasecretaparafirmareltoken'
    }, async ( jwt_payload, done )=>{
        try {
            const {_id,role}=jwt_payload
            const user = await usersService.getUser({_id})
            console.log('jwt_payload passport config: ', jwt_payload )
            return done(null, user)            
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.e7d6f54064887e25',
        clientSecret: 'ddb3814b2a5324be76b1a89f122f51f6730774f2',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
        scope: ['user:email'],
    }, async (accesToken, refreshToken, profile, done)=> {
        try {
            let user = await usersService.getUser({email:!profile._json.email?profile.emails[0].value:profile._json.email})
            if (!user) {
                let userNew = {
                    first_name: profile.username,
                    email: !profile._json.email?profile.emails[0].value:profile._json.email
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
        let user = await usersService.geUser({_id: id})
        done(null, user)
    })


}