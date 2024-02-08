const { Router } = require('express');
const ProductsController = require('../controller/products.controller');

const { 
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} = new ProductsController()

const router = Router();

router
    .get('/', getProducts)
    .get('/:pid', getProductById)
    .post('/', addProduct)
    .put('/:pid', updateProduct)
    .delete('/:pid', deleteProduct)

module.exports = router;