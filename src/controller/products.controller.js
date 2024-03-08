const { productsService } = require('../repositories');
const { logger } = require('../utils/logger');

class ProductsController {
    constructor() {
        this.service = productsService
    }
    getProducts = async (req, res) => {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            const dataProducts = await this.service.getProducts(limit, page, sort, query);
            return res.status(200).json(dataProducts);
        } catch (error) {
            logger.error('Error al obtener productos:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener productos',
                error: error.message,
                cause: error.cause
            });
        }
    }
    getProductById = async (req, res) => {
        try {
            const { pid } = req.params;
            let dataProducts = await this.service.getProduct({ _id: pid });
            return res.status(200).json(dataProducts);
        } catch (error) {
            logger.error('Error al obtener producto.', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener producto.',
                error: error.message,
                cause: error.cause
            });
        }
    }
    addProduct = async (req, res) => {
        try {
            const product = req.body;
            const newProducts = await this.service.createProduct(product);
            return res.status(200).json(newProducts);
        } catch (error) {
            logger.error('Error al insertar producto:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al insertar producto.',
                error: error.message,
                cause: error.cause
            });
        }
    }
    updateProduct = async (req, res) => {
        try {
            const product = req.body;
            const { pid } = req.params;
            const newProducts = await this.service.updateProduct(pid, product);
            return res.status(200).json(newProducts);
        } catch (error) {
            logger.error('Error al modificar producto:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al modificar producto.',
                error: error.message,
                cause: error.cause
            });
        }
    }
    deleteProduct = async (req, res) => {
        try {
            const { pid } = req.params;
            const newProducts = await this.service.deleteProduct(pid);
            return res.status(200).json(newProducts);
        } catch (error) {
            logger.error('Error al eliminar producto:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al eliminar producto.',
                error: error.messageb,
                cause: error.cause
            });
        }
    }
}

module.exports = ProductsController