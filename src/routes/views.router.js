const { Router } = require('express')
const { ProductMongo } = require('../daos/Mongo/productsDaoMongo');
const { MessageMongo } = require('../daos/Mongo/messagesDaoMongo');
const { CartMongo } = require('../daos/Mongo/cartsDaoMongo');

const router = Router()
const productService = new ProductMongo();
const messageService = new MessageMongo();
const cartService = new CartMongo();


router.get('/', async (req,res)=> {
    const {data}=await productService.getProducts();
    res.render('home', {
        title: 'Productos',
        products:data
    })
})

router.get('/realtimeproducts',async (req, res) => {
    const {data}=await productService.getProducts();
    res.render('realTimeProducts', {
        title: 'Productos en tiempo real',
        products: data
    })
})

router.get('/chat',async (req, res) => {
    const {data}=await messageService.getMessages();
    res.render('chat', {
        title: 'Chat',
        chatData: data
    })
})

router.get('/products',async (req, res) => {
    const { page=1, limit=10,sort,query } = req.query
    const {payload,hasPrevPage,hasNextPage,prevLink,nextLink,...rest}=await productService.getProducts(limit,page,sort,query);
    res.render('products', {
        title: 'Products',
        payload,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
        page:rest.page
    })
})

router.get('/products/:productId', async (req, res) => {
    const { productId } = req.params;
    const product = await productService.getProductById(productId);
    res.render('productDetails', {
        title: 'Detalles del Producto',
        product:product.payload
    });
});

router.get('/carts/:cid',async (req, res) => {
    const { cid } = req.params
    const {data}=await cartService.getProductsByCartId(cid);
    res.render('carts', {
        title: 'Cart',
        cartProducts:data.products
    })
})

router.post('/addToCart', async (req, res) => {
    const { productId } = req.body;
    const idCart="65888604f15942beaa30a427"
    const addProductCart = await cartService.addProductByCartId(idCart, productId);
    res.sendStatus(200);
});

module.exports = router