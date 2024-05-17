const passport = require('passport')
const passport_jwt = require('passport-jwt')
const GithubStrategy = require('passport-github2')
const { userService, cartsService } = require('../repositories')
const { configObject } = require('./configObject');

const JWTStrategy = passport_jwt.Strategy
const ExtractJWT = passport_jwt.ExtractJwt

exports.initializePassport = () => {


    const cookieExtractor = req => {
        let token = null
        if (req && req.cookies) {
            token = req.cookies[configObject.Cookie_auth]
        }
        return token
    }
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: configObject.Jwt_private_key
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('github', new GithubStrategy({
        clientID: configObject.Github_client_Id,
        clientSecret: configObject.Github_client_Secret,
        callbackURL: configObject.Github_callback_Url,
        scope: ['user:email'],
    }, async (accesToken, refreshToken, profile, done) => {
        try {

            let userExist = await userService.existsUser({ email: !profile._json.email ? profile.emails[0].value : profile._json.email })
            if (!userExist) {
                const cart = await cartsService.createNewCart();
                let userNew = {
                    first_name: profile.username,
                    email: !profile._json.email ? profile.emails[0].value : profile._json.email,
                    cart: cart.data._id
                }
                let result = await userService.createUser(userNew)
                return done(null, result)
            }else{
                let user = await userService.existsUser({ email: !profile._json.email ? profile.emails[0].value : profile._json.email },false)
                return done(null, user)
            }

        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await userService.getUser({ _id: id }, false)
        done(null, user)
    })


}