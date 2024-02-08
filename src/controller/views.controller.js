const { configObject } = require("../config");
const { productsService, messageService, usersService, cartsService } = require("../daos/Mongo");

class ViewsController{
    constructor(){
    }
    loginView= async (req, res) => {
        if (req.cookies.token) {
            res.redirect('/products');
        } else {
            res.render('login', {
                title: 'Login',
            });
        }
    }
    registerView= async (req, res) => {
        if (req.cookies.token) {
            res.redirect('/products');
        } else {
            res.render('register', {
                title: 'Registrarse',
            });
        }
    }
    logout= async (req, res) => {
        res.clearCookie(configObject.Cookie_auth);
        res.redirect('/');
    }
    home= async (req, res) => {
        const { payload } = await productsService.getProducts();
        res.render('home', {
            title: 'Productos',
            products: payload,
            userName: req.session?.user?.first_name,
            userRole: req.session?.user?.role,
        })
    }
    realtimeProducts= async (req, res) => {
        const { payload } = await productsService.getProducts();
        res.render('realTimeProducts', {
            title: 'Productos en tiempo real',
            products: payload,
            userName: req.session?.user?.first_name,
            userRole: req.session?.user?.role,
        })
    }
    chat= async (req, res) => {
        const { data } = await messageService.getMessages();
        res.render('chat', {
            title: 'Chat',
            chatData: data,
            userName: req.session?.user?.first_name,
            userRole: req.session?.user?.role,
        })
    }
    productsView=  async (req, res) => {
        const {id,role} = req.user
        const {cart,first_name}=await usersService.getUser({_id:id});
        const { page = 1, limit = 10, sort, query } = req.query
        const { payload, hasPrevPage, hasNextPage, prevLink, nextLink, ...rest } = await productsService.getProducts(limit, page, sort, query);
        res.render('products', {
            title: 'Products',
            userName: first_name,
            userRole: role,
            payload,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
            page: rest.page,
            cart
        })
    }
    addToCart=  async (req, res) => {
        const { productId } = req.body;
        const {id}=res.locals.currentUser;
        const {cart}=await usersService.getUser({_id:id})
        const idCart = cart
        const addProductCart = await cartsService.addProductByCartId(idCart, productId);
        res.status(200).json(addProductCart);
    }
    user=  async (req, res) => {
        let users = []
        if (req.session?.user?.role === 'admin') {
            users = await usersService.getUsers()
        }
        res.render('user', {
            title: 'Usuario',
            users: users,
            userName: req.session?.user?.first_name,
            first_name: req.session?.user?.first_name,
            last_name: req.session?.user?.last_name,
            email: req.session?.user?.email,
            userRole: req.session?.user?.role
        });
    }
    productDetail= async (req, res) => {
        const { productId } = req.params;
        const product = await productsService.getProductById(productId);
        res.render('productDetails', {
            title: 'Detalles del Producto',
            product: product.payload,
            userName: req.session?.user?.first_name,
            userRole: req.session?.user?.role,
        });
    }
    cartDetail=  async (req, res) => {
        const { cid } = req.params
        const {id}=res.locals.currentUser;
        const {first_name,role,cart}=await usersService.getUser({_id:id})
        const { data } = await cartsService.getProductsByCartId(cid);
        res.render('carts', {
            title: 'Cart',
            cartProducts: data.products,
            userName: first_name,
            userRole: role,
            cart
        })
    }
}

module.exports=ViewsController