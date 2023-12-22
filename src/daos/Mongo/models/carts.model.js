const { Schema, model } = require('mongoose');

const cartSchema = new Schema({
    product: { type: Array, default: [] },
});

const cartModel = model('carts', cartSchema);

module.exports = {
    cartModel
}