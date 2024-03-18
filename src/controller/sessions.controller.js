const { configObject } = require('../config/configObject');
const { userService, cartsService } = require('../repositories')
const { createHash, isValidPassword } = require("../utils/hashPassword");
const { createToken } = require("../utils/jwt");
const CustomError = require("../utils/error/customErrors");
const validateFields = require("../utils/validators");
const { enumErrors } = require("../utils/error/errorEnum");
const { logger } = require("../utils/logger");

class SessionsController {
    constructor() {
    }
    register = async (req, res) => {
        try {
            const requieredfield = ['first_name', 'last_name', 'email', 'birthdate', 'password'];
            const userData = validateFields(req.body, requieredfield);

            const userFound = await userService.existsUser({ email: userData.email });

            if (userFound) {
                CustomError.createError({
                    cause: "Ya existe un usuario con ese email",
                    message: `Error al registrar usuario`,
                    code: enumErrors.DATABASE_ERROR
                })
            }

            const cart = await cartsService.createNewCart();
            const newUser = {
                first_name: userData.first_name,
                last_name: userData.last_name,
                birthdate: userData.birthdate,
                email: userData.email,
                password: createHash(userData.password),
                cart: cart.data._id,
            };

            await userService.createUser(newUser);

            return res.status(200).json({ message: 'Se ha registrado satisfactoriamente' });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al registrar usuario',
                error: error.message,
                cause: error.cause
            });
        }
    }
    login = async (req, res) => {
        const requieredfield = ['email', 'password'];
        const userData = validateFields(req.body, requieredfield);
        try {
            if (userData.email === configObject.Admin_user_email && userData.password === configObject.Admin_user_password) {
                const token = createToken({
                    first_name: 'admin',
                    email: configObject.Admin_user_email,
                    role: 'admin'
                });
                res.cookie(configObject.Cookie_auth, token, {
                    maxAge: 60 * 60 * 1000 * 24,
                    httpOnly: true,
                    secure: true,
                    sameSite: 'lax',
                    credentials: true 
                });
                // return res.redirect('/products');
            }

            const { payload: userFound } = await userService.getUser({ email: userData.email }, false);
            
            if (!userFound || !isValidPassword(userData.password, { password: userFound.password })) CustomError.createError({
                cause: `Email o contraseña equivocado`,
                message: `Error al iniciar sesion`,
                code: enumErrors.INVALID_TYPES_ERROR
            })
            
            const token = createToken({ id: userFound._id, role: userFound.role })
            console.log(configObject.Cookie_auth+' '+token)
            res.cookie(configObject.Cookie_auth, token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true,
                secure: true,
                credentials: true ,
                sameSite: 'lax',
                credentials: true 
            })
            // res.redirect('/products');
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al logear usuario',
                error: error.message,
                cause: error.cause
            });
            // res.render('login', {
            //     title: 'Login',
            //     answer: error.cause
            // });
        }
    }
    github = async (req, res) => {
    }
    githubCallback = async (req, res) => {
        try {
            const user = req.user;

            const token = createToken({ id: user._id, role: user.role });

            res.cookie(configObject.Cookie_auth, token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true
            });

            res.redirect("/");
        } catch (error) {
            logger.error(error);
        }
    }
    logout = async (req, res) => {
        res.clearCookie(configObject.Cookie_auth);
        res.redirect('/');
    }
    current = async (req, res) => {
        try {
            res.send('datos sensibles')
        } catch (error) {
            logger.error(error);
        }
    }
}

module.exports = SessionsController