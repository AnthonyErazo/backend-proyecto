const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, precision: 2, required: true },
    thumbnail: { type: Array },
    code: { type: Number, unique: true, required: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, default: true, required: true },
    category: { type: String, required: true },
});

const productModel = model('products', productSchema);

module.exports = {
    productModel
}