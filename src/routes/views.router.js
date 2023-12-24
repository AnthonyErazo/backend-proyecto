const { Router } = require('express')
const { ProductMongo } = require('../daos/Mongo/productsDaoMongo');
const { MessageMongo } = require('../daos/Mongo/messagesDaoMongo');

const router = Router()
const productService = new ProductMongo();
const messageService = new MessageMongo();


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

module.exports = router