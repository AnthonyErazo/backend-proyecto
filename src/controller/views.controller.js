const { configObject } = require("../config");
const { productsService,messageService,userService,cartsService }=require('../repositories')

const dataUser =async (req,res) =>{
    if(req.user){
        if(req.user.role=='admin') return {first_name:req.user.first_name,email:req.user.email,role:req.user.role}
        const {payload}=await userService.getUser({_id:req.user.id},true);
        return payload
    }else{
        return null
    }
}
class ViewsController{
    constructor(){
    }
    loginView= async (req, res) => {
        if (req.user) {
            res.redirect('/products');
        } else {
            res.render('login', {
                title: 'Login',
            });
        }
    }
    registerView= async (req, res) => {
        if (req.user) {
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
        const user=await dataUser(req,res)
        const { payload } = await productsService.getProducts();
        res.render('home', {
            title: 'Productos',
            products: payload,
            userName: user?.first_name,
            userRole: user?.role,
            cart:user?.cart
        })
    }
    realtimeProducts= async (req, res) => {
        const user=await dataUser(req,res)
        const { payload } = await productsService.getProducts();
        res.render('realTimeProducts', {
            title: 'Productos en tiempo real',
            products: payload,
            userName: user.first_name,
            userRole: user.role,
        })
    }
    chat= async (req, res) => {
        const user=await dataUser(req,res)
        const { data } = await messageService.getMessages();
        res.render('chat', {
            title: 'Chat',
            chatData: data,
            userName: user.first_name,
            userRole: user.role,
            email:user.email,
            cart:user.cart
        })
    }
    productsView=  async (req, res) => {
        const user=await dataUser(req,res)
        const { page = 1, limit = 10, sort, query } = req.query
        const { payload, hasPrevPage, hasNextPage, prevLink, nextLink, ...rest } = await productsService.getProducts(limit, page, sort, query);
        res.render('products', {
            title: 'Products',
            userName: user?.first_name,
            userRole: user?.role,
            payload,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
            page: rest.page,
            cart:user?.cart
        })
    }
    addToCart=  async (req, res) => {
        const { productId } = req.body;
        const {cart:idCart}=await dataUser(req,res)
        const addProductCart = await cartsService.addProductByCartId(idCart, productId);
        res.status(200).json(addProductCart);
    }
    user=  async (req, res) => {
        const user=await dataUser(req,res)
        let users=[]
        if (user.role === 'admin') {
            const {payload} = await userService.getUsers()
            users=payload
        }
        res.render('user', {
            title: 'Usuario',
            users: users,
            userName: user?.first_name,
            first_name: user?.first_name,
            last_name: user?.last_name,
            email: user?.email,
            userRole: user?.role,
            cart:user?.cart
        });
    }
    productDetail= async (req, res) => {
        const user=await dataUser(req,res)
        const { productId } = req.params;
        const product = await productsService.getProduct({_id:productId});
        res.render('productDetails', {
            title: 'Detalles del Producto',
            product: product.payload,
            userName: user?.first_name,
            userRole: user?.role,
            cart:user?.cart
        });
    }
    cartDetail=  async (req, res) => {
        const {cid}=req.params
        const user=await dataUser(req,res)
        const { data } = await cartsService.getProductsByCartId(cid);
        res.render('carts', {
            title: 'Cart',
            cartProducts: data.products,
            userName: user?.first_name,
            userRole: user?.role,
            cart:cid
        })
    }
}

module.exports=ViewsController