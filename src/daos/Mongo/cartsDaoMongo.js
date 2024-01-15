const { ObjectId } = require('mongoose').Types;
const { cartModel } = require("./models/carts.model.js");

class CartDaoMongo {
    constructor() {
        this.model = cartModel;
    }

    async createNewCart() {
        const newCart = await this.model.create({});
        return { success: true, data: newCart };
    }

    async getProductsByCartId(cid) {
        const cart = await this.model.findOne({ _id: new ObjectId(cid) }).lean();

        if (cart) {
            return { success: true, data: cart };
        } else {
            throw new Error('Carrito no encontrado')
        }
    }

    async addProductByCartId(cid, pid) {
        const cart = await this.model.findOneAndUpdate(
            { _id: new ObjectId(cid), "products.product": new ObjectId(pid) },
            { $inc: { "products.$.quantity": 1 } },
            { new: true }
        );

        if (!cart) {
            const newCart = await this.model.findOneAndUpdate(
                { _id: new ObjectId(cid), "products.product": { $ne: new ObjectId(pid) } },
                { $push: { products: { product: pid, quantity: 1 } } },
                { new: true }
            );

            if (!newCart) {
                throw new Error("Carrito no encontrado.")
            }

            return { success: true, data: newCart, message: 'Producto añadido al carrito correctamente' };
        }

        return { success: true, data: cart, message: 'Producto añadido al carrito correctamente' };
    }

    async removeProductByCartId(cid, pid) {
        const result = await this.model.updateOne(
            { _id: new ObjectId(cid) },
            { $pull: { products: { product: new ObjectId(pid) } } }
        );
        if (result.modifiedCount > 0) {
            return { success: true, result, message: 'Producto eliminado del carrito correctamente' };
        } else {
            throw new Error('El producto no está en el carrito')
        }
    }

    async removeAllProductsByCartId(cid) {
        const result = await this.model.updateOne(
            { _id: new ObjectId(cid) },
            { $set: { products: [] } }
        );

        if (result.modifiedCount > 0) {
            return { success: true, message: 'Todos los productos fueron eliminados del carrito correctamente' };
        } else {
            throw new Error('El carrito no contiene productos')
        }
    }

    async updateProductQuantity(cid, pid, newQuantity) {
        const cart = await this.model.findOneAndUpdate(
            { _id: new ObjectId(cid), "products.product": new ObjectId(pid) },
            { $set: { "products.$.quantity": newQuantity.quantity } },
            { new: true }
        );

        if (!cart) {
            throw new Error('Carrito no encontrado o producto no está en el carrito.')
        }

        return { success: true, data: cart, message: 'Cantidad del producto actualizada correctamente' };
    }

    async updateProductsInCart(cid, updatedProducts) {
        let updatedCart = await this.model.findById(cid);

        if (!updatedCart) {
            throw new Error('Carrito no encontrado.')
        }

        for (const { product, quantity } of updatedProducts) {
            updatedCart = await this.model.findOneAndUpdate(
                { _id: updatedCart._id, "products.product": new ObjectId(product) },
                { $set: { "products.$.quantity": quantity } },
                { new: true }
            );

            if (!updatedCart) {
                updatedCart = await this.model.findByIdAndUpdate(
                    cid,
                    { $addToSet: { products: { product: new ObjectId(product), quantity } } },
                    { new: true }
                );
            }
        }

        return { success: true, data: updatedCart, message: 'Productos en el carrito actualizados correctamente' };
    }


}

exports.CartMongo = CartDaoMongo;