const passport = require('passport')
const handlebars = require('handlebars')
const { Router } = require('express')
const { authentication } = require('../middleware/auth.middleware')
const ViewsController = require('../controller/views.controller')

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
    .get('/', loginView)
    .get('/register', registerView)
    .get('/logout', logout)
    .get('/home', home)
    .get('/realtimeproducts', realtimeProducts)
    .get('/chat', chat)
    .get('/products', passport.authenticate('jwt', {
        session: false,
        failureRedirect: "/"
    }), productsView)
    .get('/products/:productId', productDetail)
    .get('/carts/:cid', cartDetail)
    .post('/addToCart', addToCart)
    .get('/user', authentication, user)

module.exports = router