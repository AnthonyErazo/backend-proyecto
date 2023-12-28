const { ObjectId } = require('mongoose').Types;
const { cartModel } = require("./models/carts.model.js");

class CartDaoMongo {
    constructor() {
        this.model = cartModel;
    }

    async createNewCart() {
        try {
            const newCart = await this.model.create({});
            return { success: true, data: newCart };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al crear un nuevo carrito', error: error.message };
        }
    }

    async getProductsByCartId(cid) {
        try {
            const cart = await this.model.findOne({ _id: new ObjectId(cid) }).lean();

            if (cart) {
                return { success: true, data: cart };
            } else {
                return { success: false, message: 'Carrito no encontrado' };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al obtener productos del carrito', error: error.message };
        }
    }

    async addProductByCartId(cid, pid) {
        try {
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
                    return { success: false, message: "Carrito no encontrado." };
                }

                return { success: true, data: newCart, message: 'Producto añadido al carrito correctamente' };
            }

            return { success: true, data: cart, message: 'Producto añadido al carrito correctamente' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al procesar la solicitud' };
        }
    }

    async removeProductByCartId(cid, pid) {
        try {
            const result = await this.model.updateOne(
                { _id: new ObjectId(cid) },
                { $pull: { products: { product: new ObjectId(pid) } } }
            );
            if (result.modifiedCount > 0) {
                return { success: true, result, message: 'Producto eliminado del carrito correctamente' };
            } else {
                return { success: false, result, message: 'El producto no está en el carrito' };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al procesar la solicitud' };
        }
    }

    async removeAllProductsByCartId(cid) {
        try {
            const result = await this.model.updateOne(
                { _id: new ObjectId(cid) },
                { $set: { products: [] } }
            );

            if (result.modifiedCount > 0) {
                return { success: true, message: 'Todos los productos fueron eliminados del carrito correctamente' };
            } else {
                return { success: false, message: 'El carrito no contiene productos' };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al procesar la solicitud' };
        }
    }

    async updateProductQuantity(cid, pid, newQuantity) {
        try {
            const cart = await this.model.findOneAndUpdate(
                { _id: new ObjectId(cid), "products.product": new ObjectId(pid) },
                { $set: { "products.$.quantity": newQuantity.quantity } },
                { new: true }
            );

            if (!cart) {
                return { success: false, message: 'Carrito no encontrado o producto no está en el carrito.' };
            }

            return { success: true, data: cart, message: 'Cantidad del producto actualizada correctamente' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al procesar la solicitud' };
        }
    }

    async updateProductsInCart(cid, updatedProducts) {
        try {
            let updatedCart = await this.model.findById(cid);

        if (!updatedCart) {
            return { success: false, message: 'Carrito no encontrado.' };
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
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al procesar la solicitud' };
        }
    }


}

exports.CartMongo = CartDaoMongo;