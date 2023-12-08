const { Router } = require('express');
const ProductManager = require('../managers/productManager.js');

const router = Router();
const productsService = new ProductManager();

router
    .get('/', async (req, res) => {
        try {
            const { limit, ...otherParams } = req.query;
            if (Object.keys(otherParams).length > 0 || (limit !== undefined && isNaN(parseInt(limit)))) return res.status(200).json({ status: 'ok', data: [] });
            const dataProducts = await productsService.getProducts();
            if (limit === undefined || isNaN(parseInt(limit))) return res.status(200).json({ status: 'ok', data: dataProducts });
            const limitedProducts = dataProducts.slice(0, parseInt(limit));
            return res.status(200).json({ status: 'ok', data: limitedProducts });
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
            newProducts=await productsService.addProduct(product);
            
            return res.status(200).json({ status: 'ok', data: newProducts});
        } catch (error) {
            console.error('Error al insertar producto:', error);
            return res.status(500).json({ status: 'error', message: 'Error al insertar producto.' });
        }
    })
    .put('/:pid', async (req, res) => {
        try {
            const product = req.body;
            const { pid } = req.params;
            const newProducts=await productsService.updateProduct(pid, product);
            return res.status(200).json({ status: 'ok', data: newProducts });
        } catch (error) {
            console.error('Error al modificar producto:', error);
            return res.status(500).json({ status: 'error', message: 'Error al modificar producto.' });
        }
    })
    .delete('/:pid', async (req, res) => {
        try {
            const { pid } = req.params;
            const newProducts=await productsService.deleteProduct(pid);
            return res.status(200).json({ status: 'ok', data: newProducts });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            return res.status(500).json({ status: 'error', message: 'Error al eliminar producto.' });
        }
    })

module.exports = router;