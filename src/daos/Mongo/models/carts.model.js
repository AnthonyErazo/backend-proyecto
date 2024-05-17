const { Schema, model } = require('mongoose');

const cartSchema = new Schema({
    products: { type: [
        {
            product:{
                type:Schema.Types.ObjectId,
                ref:'products',
                required:true
            },
            quantity:{type:Number}
        }
    ] },
});

cartSchema.pre('findOne',function () {
    this.populate('products.product')
})

const cartModel = model('carts', cartSchema);

module.exports = {
    cartModel
}