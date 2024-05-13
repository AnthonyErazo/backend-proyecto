const { Router } = require('express');
const ProductsController = require('../controller/products.controller');
const { isUser, isAdminOrPremium } = require('../middleware/verifiqueRole.middleware');

const { 
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} = new ProductsController()

const router = Router();

router
    .get('/',getProducts)
    .get('/:pid', getProductById)
    .post('/',isAdminOrPremium, addProduct)
    .put('/:pid',isAdminOrPremium, updateProduct)
    .delete('/:pid',isAdminOrPremium, deleteProduct)

module.exports = router;