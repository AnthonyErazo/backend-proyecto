const { Router } = require('express')
const { ProductMongo } = require('../daos/Mongo/productsDaoMongo');

const router = Router()
const productService = new ProductMongo();


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
    res.render('chat', {
        title: 'Chat'
    })
})

module.exports = router