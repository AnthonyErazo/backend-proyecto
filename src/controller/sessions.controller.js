const { configObject } = require("../config");
const { userService,cartsService }=require('../repositories')
const CustomError = require("../utils/errors");
const { createHash, isValidPassword } = require("../utils/hashPassword");
const { createToken } = require("../utils/jwt");
const validateFields = require("../utils/validators");

class SessionsController{
    constructor(){
    }
    register= async (req, res) => {
        try {
            const requieredfield = ['first_name', 'last_name', 'email', 'birthdate', 'password'];
            const userData = validateFields(req.body, requieredfield);

            const userFound = await userService.existsUser({ email: userData.email });

            if (userFound) throw new CustomError(`Ya existe un usuario con ese email, pruebe con otro`)

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

            res.render('login', {
                title: 'Login',
                answer: 'Se ha registrado satisfactoriamente',
            });
        } catch (error) {
            console.error(error);
            if (error instanceof CustomError) {
                res.render('register', { title: 'Registrase', answer: error.message });
            } else {
                res.render('register', {
                    title: 'Registrase',
                    answer: 'Ocurrio un error, vuelva a intentarlo',
                });
            }
        }
    }
    login= async (req, res) => {
        const requieredfield = ['email', 'password'];
        const userData = validateFields(req.body, requieredfield);
        try {
            if (userData.email === configObject.Admin_user_email && userData.password === configObject.Admin_user_password) {
                req.session.user = {
                    first_name: 'admin',
                    email: configObject.Admin_user_email,
                    role: 'admin',
                };
                return res.redirect('/products');
            }

            const {payload:userFound} = await userService.getUser({ email: userData.email });

            if (!userFound || !isValidPassword(userData.password, { password: userFound.password })) throw new CustomError(`Email o contraseña equivocado`);

            const token = createToken({ id: userFound._id, role: userFound.role })
            res.cookie(configObject.Cookie_auth, token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true
            })
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            if (error instanceof CustomError) {
                res.render('login', {
                    title: 'Login',
                    answer: error.message
                });
            } else {
                res.render('login', {
                    title: 'Login',
                    answer: 'Ocurrio un error, vuelva a intentarlo'
                });
            }
        }
    }
    github= async (req, res) => {
    }
    githubCallback= async (req, res) => {
        try {
            const user = req.user;

            const token = createToken({id:user._id,role:user.role});

            res.cookie(configObject.Cookie_auth, token);

            res.redirect("/");
        } catch (error) {
            console.log(error);
        }
    }
    logout= async (req, res) => {
        req.session.destroy((err) => {
            if (err) return res.send({ status: 'error', error: err });
        });
        res.redirect('/');
    }
    current= async (req, res) => {
        try {
            res.send('datos sensibles')
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports=SessionsController