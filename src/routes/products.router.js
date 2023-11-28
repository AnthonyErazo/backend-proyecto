const { Router } = require('express');
const ProductManager = require('../managers/productManager.js');

const router = Router();
const productsService = new ProductManager();

router
    .get('/', async (req, res) => {
        try {
            const { limit } = req.query;
            let dataProducts = await productsService.getProducts();
            if (!!limit) dataProducts = dataProducts.slice(0, parseInt(limit));
            return res.status(200).json({ status: 'ok', data: dataProducts });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return res.status(500).json({ status: 'error', message: 'Error al obtener productos.' });
        }
    })
    .get('/:pid', async (req, res) => {
        try {
            const { pid } = req.params;
            let dataProducts = await productsService.getProductById(pid);
            if (dataProducts !== null) {
                return res.status(200).json({ status: 'ok', data: dataProducts });
            } else {
                return res.status(404).json({ status: 'error', message: 'Producto no encontrado.' });
            }
        } catch (error) {
            console.error('Error al obtener producto.', error);
            return res.status(500).json({ status: 'error', message: 'Error al obtener producto.' });
        }
    })
    .post('/', async (req, res) => {
        try {
            const product = req.body;
            await productsService.addProduct(product);
            return res.status(200).json({ status: 'ok', data: product });
        } catch (error) {
            console.error('Error al insertar producto:', error);
            return res.status(500).json({ status: 'error', message: 'Error al insertar producto.' });
        }
    })
    .put('/:pid', async (req, res) => {
        try {
            const product = req.body;
            const { pid } = req.params;
            await productsService.updateProduct(pid, product);
            return res.status(200).json({ status: 'ok', data: product });
        } catch (error) {
            console.error('Error al modificar producto:', error);
            return res.status(500).json({ status: 'error', message: 'Error al modificar producto.' });
        }
    })
    .delete('/:pid', async (req, res) => {
        try {
            const { pid } = req.params;
            await productsService.deleteProduct(pid);
            return res.status(200).json({ status: 'ok', data: [] });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            return res.status(500).json({ status: 'error', message: 'Error al eliminar producto.' });
        }
    })

module.exports = router;