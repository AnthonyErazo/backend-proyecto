const { ObjectId } = require('mongoose').Types;
const { cartModel } = require("./models/carts.model.js");
const CustomError = require('../../utils/error/customErrors');
const { enumErrors } = require('../../utils/error/errorEnum.js');
const { generateCartErrorInfo } = require('../../utils/error/generateInfoError.js');
const { enumActionsErrors } = require('../../utils/error/enumActionsErrors.js');

class CartDaoMongo {
    constructor() {
        this.model = cartModel;
    }

    async create() {
        const newCart = await this.model.create({});
        return { success: "success", data: newCart };
    }

    async getProductsBy(cid) {
        const cart = await this.model.findOne({ _id: new ObjectId(cid) }).lean();

        if (cart) {
            return { success: "success", data: cart };
        } else {
            CustomError.createError({
                name:"CART ERROR",
                code:enumErrors.DATABASE_ERROR,
                message:generateCartErrorInfo(cart,enumActionsErrors.ERROR_GET),
                cause:"Carrito no encontrado",
            })
        }
    }

    async addProductBy(cid, pid) {
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
                CustomError.createError({
                    name:"CART ERROR",
                    code:enumErrors.DATABASE_ERROR,
                    message:generateCartErrorInfo(newCart,enumActionsErrors.ERROR_ADD),
                    cause:"Carrito no encontrado",
                })
            }

            return { success: "success", data: newCart, message: 'Producto añadido al carrito correctamente' };
        }

        return { success: "success", data: cart, message: 'Producto añadido al carrito correctamente' };
    }

    async removeProductBy(cid, pid) {
        const result = await this.model.updateOne(
            { _id: new ObjectId(cid) },
            { $pull: { products: { product: new ObjectId(pid) } } }
        );
        if (result.modifiedCount > 0) {
            return { success: "success", result, message: 'Producto eliminado del carrito correctamente' };
        } else {
            CustomError.createError({
                name:"CART ERROR",
                code:enumErrors.DATABASE_ERROR,
                message:generateCartErrorInfo(result,enumActionsErrors.ERROR_DELETE),
                cause:"El producto no está en el carrito",
            })
        }
    }

    async removeAllProductsBy(cid) {
        const result = await this.model.updateOne(
            { _id: new ObjectId(cid) },
            { $set: { products: [] } }
        );

        if (result.modifiedCount > 0) {
            return { success: "success", message: 'Todos los productos fueron eliminados del carrito correctamente' };
        } else {
            CustomError.createError({
                name:"CART ERROR",
                code:enumErrors.DATABASE_ERROR,
                message:generateCartErrorInfo(result,enumActionsErrors.ERROR_DELETE),
                cause:"El carrito no contiene productos",
            })
        }
    }

    async updateProductQuantity(cid, pid, newQuantity) {
        const cart = await this.model.findOneAndUpdate(
            { _id: new ObjectId(cid), "products.product": new ObjectId(pid) },
            { $set: { "products.$.quantity": newQuantity.quantity } },
            { new: true }
        );

        if (!cart) {
            CustomError.createError({
                name:"CART ERROR",
                code:enumErrors.DATABASE_ERROR,
                message:generateCartErrorInfo(cart,enumActionsErrors.ERROR_UPDATE),
                cause:"Carrito no encontrado o producto no está en el carrito.",
            })
        }

        return { success: "success", data: cart, message: 'Cantidad del producto actualizada correctamente' };
    }

    async updateProductsInCart(cid, updatedProducts) {
        let updatedCart = await this.model.findById(cid);

        if (!updatedCart) {
            CustomError.createError({
                name:"CART ERROR",
                code:enumErrors.DATABASE_ERROR,
                message:generateCartErrorInfo(updatedCart,enumActionsErrors.ERROR_UPDATE),
                cause:"Carrito no encontrado.",
            })
        }
        updatedCart.products = [];

        for (const { product, quantity } of updatedProducts) {
            updatedCart.products.push({ product: new ObjectId(product), quantity });
        }
    
        updatedCart = await updatedCart.save();

        return { success: "success", data: updatedCart, message: 'Productos en el carrito actualizados correctamente' };
    }
    async deleteCart(cid) {
        return await this.model.deleteOne({_id:cid});
    }


}

exports.CartMongo = CartDaoMongo;