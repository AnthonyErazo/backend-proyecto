const { ObjectId } = require('mongoose').Types;
const { cartModel } = require("./models/carts.model.js");
const { ProductMongo } = require('./productsDaoMongo.js');

class CartDaoMongo {
    constructor() {
        this.model = cartModel;
        this.productDao = new ProductMongo();
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
                const productQuantities = cart.product.map(({ id, quantity }) => ({ id, quantity }));
                const details = await this.productDao.getProductsDetails(productQuantities);

                const cartCopy = { ...cart, product: details.data };
                return { success: true, data: cartCopy };
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

            const product = await this.productDao.getProductById(pid);

            if (!product.success) {
                return { success: false, message: product.message };
            }

            const existingProductIndex = cart.product.findIndex((p) => p.id.toString() === pid);

            if (existingProductIndex !== -1) {
                cart.product[existingProductIndex].quantity += 1;
            } else {
                cart.product.push({ id: pid, quantity: 1 });
            }

            await cart.save();

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

            const product = await this.productDao.getProductById(pid);
            if (!product.success) {
                return { success: false, message: product.message };
            }

            const existingProductIndex = cart.product.findIndex((p) => p.id.toString() === pid);

            if (existingProductIndex !== -1) {
                cart.product.splice(existingProductIndex, 1);

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