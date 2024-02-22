const { Router } = require('express');
const CartsController = require('../controller/cart.controller');

const { 
    getProductsByCartId,
    createNewCart,
    addProductByCartId,
    removeProductByCartId,
    updateProductsInCart,
    updateProductQuantity,
    removeAllProductsByCartId,
    purchaseCart
} = new CartsController()

const router = Router();

router
    .get('/:cid', getProductsByCartId)
    .post('/', createNewCart)
    .post('/:cid/product/:pid', addProductByCartId)
    .delete('/:cid/products/:pid', removeProductByCartId)
    .put('/:cid', updateProductsInCart)
    .put('/:cid/products/:pid', updateProductQuantity)
    .delete('/:cid', removeAllProductsByCartId)
    .post('/:cid/purchase',purchaseCart)
module.exports = router;