const { Router } = require('express');
const { usersService, cartsService } = require('../daos/Mongo');
const { createHash, isValidPassword } = require('../utils/hashPassword')
const passport = require('passport')
const { createToken, authenticationToken } = require('../utils/jwt')

const router = Router();

class CustomError extends Error {
    constructor(message) {
        super(message);
    }
}

const validateFields = (fields, requiredFields) => {
    const missingFields = [];
    const correctObject = requiredFields.reduce((acc, field) => {
        if (!fields[field]) {
            missingFields.push(field);
        } else {
            acc[field] = fields[field];
        }
        return acc;
    }, {});

    if (missingFields.length > 0) {
        throw new CustomError(`ERROR: Debe completar los siguientes campos: ${missingFields.join(', ')}`);
    }

    return correctObject;
};

router
    .post('/register', async (req, res) => {
        try {
            const requieredfield = ['first_name', 'last_name', 'email', 'birthdate', 'password'];
            const userData = validateFields(req.body, requieredfield);

            const userFound = await usersService.userExists({ email: userData.email });

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

            await usersService.createUser(newUser);

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
    })
    .post('/login', async (req, res) => {
        const requieredfield = ['email', 'password'];
        const userData = validateFields(req.body, requieredfield);
        try {
            if (userData.email === 'adminCoder@coder.com' && userData.password === 'adminCod3r123') {
                req.session.user = {
                    first_name: 'admin',
                    email: 'adminCoder@coder.com',
                    role: 'admin',
                };
                return res.redirect('/products');
            }

            const userFound = await usersService.getUser({ email: userData.email });

            if (!userFound || !isValidPassword(userData.password, { password: userFound.password })) throw new CustomError(`Email o contraseña equivocado`);

            const token = createToken({ id: userFound._id, role: userFound.role })
            res.cookie('token', token, {
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
    })
    .get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
        console.log('first')
    })
    .get('/githubcallback', passport.authenticate('github', { session: false, failureRedirect: '/' }), (req, res) => {
        try {
            const user = req.user;

            const token = createToken({id:user._id,role:user.role});

            res.cookie('token', token);

            res.redirect("/");
        } catch (error) {
            console.log(error);
        }
    })
    .get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) return res.send({ status: 'error', error: err });
        });
        res.redirect('/');
    })
    .get('/current', passport.authenticate("jwt", {
        session: false,
        failureRedirect: "/",
    }), async (req, res) => {
        try {
            res.send('datos sensibles')
        } catch (error) {
            console.log(error);
        }
    });

module.exports = router;