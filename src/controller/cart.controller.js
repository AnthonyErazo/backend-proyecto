const { productsService, cartsService, ticketService } = require('../repositories');
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
            console.error('Error al obtener productos del carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al obtener productos del carrito.', error: error.message });
        }
    }
    createNewCart = async (req, res) => {
        try {
            const newCart = await this.service.createNewCart();
            return res.status(200).json(newCart);
        } catch (error) {
            console.error('Error al crear carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al crear carrito.', error: error.message });
        }
    }
    addProductByCartId = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            await productsService.getProduct({ _id: pid });
            const newCart = await this.service.addProductByCartId(cid, pid);
            return res.status(200).json(newCart);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito.', error: error.message });
        }
    }
    removeProductByCartId = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const newCart = await this.service.removeProductByCartId(cid, pid);
            return res.status(200).json(newCart);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito.', error: error.message });
        }
    }
    updateProductsInCart = async (req, res) => {
        try {
            const updatedProducts = req.body;
            const { cid } = req.params;
            for (const productId of updatedProducts) {
                await productsService.getBy({ _id: productId.product })
            }
            const newCart = await this.service.updateProductsInCart(cid, updatedProducts);
            return res.status(200).json(newCart);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito.', error: error.message });
        }
    }
    updateProductQuantity = async (req, res) => {
        try {
            const newQuantity = req.body;
            const { cid, pid } = req.params;
            const newCart = await this.service.updateProductQuantity(cid, pid, newQuantity);
            return res.status(200).json(newCart);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito.', error: error.message });
        }
    }
    removeAllProductsByCartId = async (req, res) => {
        try {
            const { cid } = req.params;
            const newCart = await this.service.removeAllProductsByCartId(cid);
            return res.status(200).json(newCart);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito.', error: error.message });
        }
    }
    purchaseCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const cartResponse = await this.service.getProductsByCartId(cid);
            const ticket = await ticketService.createTicket(cartResponse);
            await this.service.updateProductsInCart(cid, ticket.productsNotProcessed);
            const to = ticket.payload.purchaser
            const subject = 'Tickect generado'
            const html = `<div>
                    <h2>Resumen de la compra</h2>
                    <p>codigo de ticket: ${ticket.payload.code}</p>
                    <p>total: ${ticket.payload.amount}</p>
                    <p>fecha de pago: ${ticket.payload.purchase_datetime}</p>
                </div>`
            sendMail(to, subject, html)
            return res.status(200).json(ticket);
        } catch (error) {
            console.error('Error al finalizar la compra:', error);
            return res.status(500).json({ status: 'error', message: 'Error al finalizar la compra', error: error.message });
        }
    }
}

module.exports = CartsController