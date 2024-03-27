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
    .post('/', createNewCart)
    .get('/:cid', getProductsByCartId)
    .put('/:cid', updateProductsInCart)
    .delete('/:cid', removeAllProductsByCartId)
    .post('/:cid/product/:pid', addProductByCartId)
    .put('/:cid/products/:pid', updateProductQuantity)
    .delete('/:cid/products/:pid', removeProductByCartId)
    .post('/:cid/purchase', purchaseCart)
module.exports = router;