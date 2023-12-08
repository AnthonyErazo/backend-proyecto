const { Router } = require('express')
const ProductManager = require('../managers/productManager')

const router = Router()
const productService = new ProductManager('./src/products.json')


router.get('/', async (req,res)=> {
    const products=await productService.getProducts();
    res.render('home', {
        title: 'Productos',
        products:products
    })
})

router.get('/realtimeproducts',async (req, res) => {
    const products=await productService.getProducts();
    res.render('realTimeProducts', {
        title: 'Productos en tiempo real',
        products: products
    })
})

module.exports = router