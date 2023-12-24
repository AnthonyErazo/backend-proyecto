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
            const cart = await this.model.findOne({ _id: new ObjectId(cid) });

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
            const cart = await this.model.findOne({ _id: new ObjectId(cid) });

            if (!cart) {
                return { success: false, message: "Carrito no encontrado." };
            }

            const existingProduct = cart.products.find(p => p.product.equals(pid));
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await this.model.updateOne(
            { _id: new ObjectId(cid) },
            { $set: { products: cart.products } }
        );

        return { success: true, data: cart, message: 'Producto añadido al carrito correctamente' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al procesar la solicitud' };
        }
    }

    async removeProductByCartId(cid, pid) {
        try {
            const cart = await this.model.findOne({ _id: new ObjectId(cid) });
            if (!cart) {
                return { success: false, message: "Carrito no encontrado." };
            }

            const existingProductIndex = cart.products.findIndex((p) => p.product.equals(pid));

            if (existingProductIndex !== -1) {
                cart.products.splice(existingProductIndex, 1);

                await cart.save();
                return { success: true, data: cart, message: 'Producto eliminado del carrito correctamente' };
            } else {
                return { success: false, message: 'El producto no está en el carrito' };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al procesar la solicitud' };
        }
    }

}

exports.CartMongo = CartDaoMongo;