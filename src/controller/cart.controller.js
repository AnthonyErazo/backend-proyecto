const { productsService, cartsService, ticketService, userService } = require('../repositories');
const { logger } = require('../utils/logger');
const { sendMail } = require('../utils/sendMail');

class CartsController {
    constructor() {
        this.service = cartsService
    }
    getProductsByCartId = async (req, res) => {
        try {
            const { cid } = req.params;
            let dataCart = await this.service.getProductsByCartId(cid);
            return res.status(200).json(dataCart);
        } catch (error) {
            logger.error('Error al obtener productos del carrito:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener productos del carrito.',
                error: error.message,
                causer: error.cause
            });
        }
    }
    createNewCart = async (req, res) => {
        try {
            const newCart = await this.service.createNewCart();
            return res.status(200).json(newCart);
        } catch (error) {
            logger.error('Error al crear carrito:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al crear carrito.',
                error: error.message,
                causer: error.cause
            });
        }
    }
    addProductByCartId = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            await productsService.getProduct({ _id: pid });
            const newCart = await this.service.addProductByCartId(cid, pid);
            return res.status(200).json(newCart);
        } catch (error) {
            logger.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al agregar producto al carrito.',
                error: error.message,
                causer: error.cause
            });
        }
    }
    removeProductByCartId = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const newCart = await this.service.removeProductByCartId(cid, pid);
            return res.status(200).json(newCart);
        } catch (error) {
            logger.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al remover producto del carrito.',
                error: error.message,
                causer: error.cause
            });
        }
    }
    updateProductsInCart = async (req, res) => {
        try {
            const updatedProducts = req.body;
            const { cid } = req.params;
            for (const productId of updatedProducts) {
                await productsService.getProduct({ _id: productId.product })
            }
            const newCart = await this.service.updateProductsInCart(cid, updatedProducts);
            return res.status(200).json(newCart);
        } catch (error) {
            logger.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al actualizar productos del carrito.',
                error: error.message,
                causer: error.cause
            });
        }
    }
    updateProductQuantity = async (req, res) => {
        try {
            const newQuantity = req.body;
            const { cid, pid } = req.params;
            const newCart = await this.service.updateProductQuantity(cid, pid, newQuantity);
            return res.status(200).json(newCart);
        } catch (error) {
            logger.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al actualizar cantidad de producto al carrito.',
                error: error.message,
                causer: error.cause
            });
        }
    }
    removeAllProductsByCartId = async (req, res) => {
        try {
            const { cid } = req.params;
            const newCart = await this.service.removeAllProductsByCartId(cid);
            return res.status(200).json(newCart);
        } catch (error) {
            logger.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al remover todos los productos del carrito.',
                error: error.message,
                causer: error.cause
            });
        }
    }
    purchaseCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const id = req.user ? req.user.id : null;
            const data = id ? await userService.getUser({ _id: id }) : null;
            const email = id ? data.payload.email : req.body;

            const cartResponse = await this.service.getProductsByCartId(cid);
            const ticket = await ticketService.createTicket(cid, cartResponse, email);
            await this.service.updateProductsInCart(cid, ticket.productsNotProcessed);

            return res.status(200).json(ticket);
        } catch (error) {
            logger.error('Error al finalizar la compra:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al finalizar la compra',
                error: error.message,
                causer: error.cause
            });
        }
    }
}

module.exports = CartsController