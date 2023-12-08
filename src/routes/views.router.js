const { Router } = require('express')
const ProductManager = require('../managers/productManager')

const router = Router()
const productService = new ProductManager('./src/products.json')

const productMock = [
    {id:'1', title: 'Product 1', price: 1500, stock: 100, description: 'Esto es un prod. '},
    {id:'2', title: 'Product 2', price: 1500, stock: 100, description: 'Esto es un prod. '},
    {id:'3', title: 'Product 3', price: 1500, stock: 100, description: 'Esto es un prod. '},
]

router.get('/', async (req,res)=> {
    const products=await productService.getProducts();
    res.render('home', {
        title: 'Productos',
        products:products
    })
})

router.get('/prod', (req, res) => {
    
    
})

module.exports = router