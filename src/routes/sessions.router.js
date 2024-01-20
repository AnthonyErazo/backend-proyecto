const { Router } = require('express');
const { usersService } = require('../daos/Mongo');
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
            const requieredfield = ['first_name', 'last_name', 'email', 'password'];
            const userData = validateFields(req.body, requieredfield);

            const userFound = await usersService.getUserByMail(userData.email);

            if (userFound) throw new CustomError(`Ya existe un usuario con ese email, pruebe con otro`)

            const newUser = {
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                password: createHash(userData.password),
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

            const userFound = await usersService.getUserByMail(userData.email);

            if (!isValidPassword(userData.password, { password: userFound.password })) throw new CustomError(`Email o contraseña equivocado`);

            const token = createToken({id: userFound._id, role: userFound.role })
            console.log(token)
            req.session.user = {
                user: userFound._id,
                first_name: userFound.first_name,
                last_name: userFound.last_name,
                email: userFound.email,
                role: userFound.role,
            };
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
    })
    .get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
        req.session.user = req.user
        res.redirect('/')
    })
    .get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) return res.send({ status: 'error', error: err });
        });
        res.redirect('/');
    });

module.exports = router;