const passport = require('passport')
const handlebars = require('handlebars')
const { Router } = require('express')
const { authentication } = require('../middleware/auth.middleware')
const ViewsController = require('../controller/views.controller')
const { isAdmin, isUser } = require('../utils/verifiqueRole')

const {
    loginView,
    registerView,
    logout,
    home,
    realtimeProducts,
    chat,
    productsView,
    productDetail,
    cartDetail,
    addToCart,
    user
} = new ViewsController()

const router = Router()

handlebars.registerHelper('excludeCurrentUser', function (currentEmail, userEmail, options) {
    if (currentEmail !== userEmail) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

router
    .get('/products',productsView)
    .get('/register', registerView)
    .get('/logout', logout)
    .get('/home', home)
    .get('/realtimeproducts',authentication,isAdmin, realtimeProducts)
    .get('/chat',authentication,isUser, chat)
    .get('/login',loginView)
    .get('/products/:productId', productDetail)
    .get('/carts/:cid',authentication,isUser, cartDetail)
    .get('/carts/', authentication, isUser, cartDetail)
    .post('/addToCart',authentication,isUser, addToCart)
    .get('/user',authentication, user)
    .get('*', (req, res) => {
        res.redirect('/products');
    });

module.exports = router