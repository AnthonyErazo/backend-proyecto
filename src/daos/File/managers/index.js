const ProductManager = require('./productManager');
const CartManager = require('./cartsManager');

const productManagerInstance = new ProductManager();
const cartManagerInstance = new CartManager();

module.exports = {
  productManager: productManagerInstance,
  cartManager: cartManagerInstance,
};