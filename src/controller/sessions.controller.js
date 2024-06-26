const { configObject } = require('../config/configObject');
const { userService, cartsService } = require('../repositories')
const { createHash, isValidPassword } = require("../utils/hashPassword");
const { createToken } = require("../utils/jwt");
const CustomError = require("../utils/error/customErrors");
const validateFields = require("../utils/validators");
const { enumErrors } = require("../utils/error/errorEnum");
const { logger } = require("../utils/logger");
const { sendMail } = require('../utils/sendMail');
const jwt = require('jsonwebtoken')

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
                last_connection:new Date(),
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
        try {
            const requieredfield = ['email', 'password'];
            const userData = validateFields(req.body, requieredfield);
            if (userData.email === configObject.Admin_user_email && userData.password === configObject.Admin_user_password) {
                const token = createToken({
                    email: configObject.Admin_user_email,
                    role: 'admin'
                });
                res.cookie(configObject.Cookie_auth, token, {
                    maxAge: 60 * 60 * 1000 * 24,
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    credentials: true
                });
                return res.status(200).json({ message: 'Login successful' });
                // return res.redirect('/products');
            }

            const { payload: userFound } = await userService.getUser({ email: userData.email }, false);

            if (!userFound || !isValidPassword(userData.password, { password: userFound.password })) {
                CustomError.createError({
                    cause: `Email o contraseña equivocado`,
                    message: `Error al iniciar sesion`,
                    code: enumErrors.INVALID_TYPES_ERROR
                })
            }
            await userService.updateUser(userFound._id,{last_connection:new Date()})
            const token = createToken({ 
                id: userFound._id, 
                role: userFound.role, 
                cart: userFound.cart})
            res.cookie(configObject.Cookie_auth, token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                credentials: true
            });
            return res.status(200).json({ message: 'Login successful' });
            // res.redirect('/products');
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al iniciar sesion',
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
        if (req.user.role!='admin') {
            await userService.updateUser(req.user.id,{last_connection:new Date()})
        }
        req.user=null
        res.clearCookie(configObject.Cookie_auth);
        res.status(200).send({})
    }
    current = async (req, res) => {
        try {
            res.send('datos sensibles')
        } catch (error) {
            logger.error(error);
        }
    }
    forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await userService.getUser({ email }, true);

            const token = jwt.sign({userId:user.payload._id}, configObject.Jwt_private_key, { expiresIn: '1h' });

            const resetLink = `http://localhost:8080/reset-password?token=${token}`;

            const html = `<div>
            <h2>Recuperación de contraseña</h2>
            <p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
            <a href="${resetLink}" method="GET" >Restablecer contraseña</a>
        </div>`;

            sendMail(email, 'Recuperación de contraseña', html);

            return res.status(200).json({ message: 'Correo de restablecimiento enviado exitosamente' });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al iniciar sesion',
                error: error.message,
                cause: error.cause
            });
        }
    }
    resetPassword = async (req, res) => {
        try {
            const token = req.params.token;
            const  {password}  = req.body;
            const decoded = jwt.verify(token, configObject.Jwt_private_key);
            const userId = decoded.userId;

            const {payload} = await userService.getUser({ _id: userId }, false);
            if (isValidPassword(password, { password: payload.password })) {
                CustomError.createError(
                    {
                        cause: `La contraseña no pueden ser iguales`,
                        message: `Error al resetear contraseña`,
                        code: enumErrors.INVALID_TYPES_ERROR
                    }
                )
            }
            await userService.updateUser(userId,{password:createHash(password)})

            return res.status(200).json({ message: 'Contraseña restablecida con éxito' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al restablecer la contraseña' });
        }
    };
}

module.exports = SessionsController