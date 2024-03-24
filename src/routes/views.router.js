const handlebars = require('handlebars')
const { Router } = require('express')
const { authentication } = require('../middleware/auth.middleware')
const ViewsController = require('../controller/views.controller')
const { isUserOrPremium,isUser, isAdminOrPremium } = require('../utils/verifiqueRole')


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
    user,
    forgotPassword,
    resetPassword
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
    .get('/realtimeproducts',authentication,isAdminOrPremium, realtimeProducts)
    .get('/chat',authentication,isUser, chat)
    .get('/login',loginView)
    .get('/products/:productId', productDetail)
    .get('/carts/:cid',authentication,isUserOrPremium, cartDetail)
    .get('/carts/', authentication, isUserOrPremium, cartDetail)
    .post('/addToCart',authentication,isUserOrPremium, addToCart)
    .get('/user',authentication, user)
    .get('/forgot-password', forgotPassword)
    .get('/reset-password', resetPassword)
    // .get('*', (req, res) => {
    //     res.redirect('/products');
    // });

module.exports = router