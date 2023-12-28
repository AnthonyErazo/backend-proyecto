const { Router } = require('express');
const {ProductMongo}=require('../daos/Mongo/productsDaoMongo');

const router = Router();
const productsService =  new ProductMongo();

router
    .get('/', async (req, res) => {
        try {
            const { limit=10,page=1,sort,query } = req.query;
            const dataProducts = await productsService.getProducts(limit,page,sort,query);
            return res.status(200).json(dataProducts);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }

    })
    .get('/:pid', async (req, res) => {
        try {
            const { pid } = req.params;
            let dataProducts = await productsService.getProductById(pid);
            return res.status(200).json(dataProducts);
        } catch (error) {
            console.error('Error al obtener producto.', error);
            return res.status(500).json({ status: 'error', message: 'Error al obtener producto.' });
        }
    })
    .post('/', async (req, res) => {
        try {
            const product = req.body;
            newProducts=await productsService.addProduct(product);
            return res.status(200).json(newProducts);
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
            return res.status(200).json(newProducts);
        } catch (error) {
            console.error('Error al modificar producto:', error);
            return res.status(500).json({ status: 'error', message: 'Error al modificar producto.' });
        }
    })
    .delete('/:pid', async (req, res) => {
        try {
            const { pid } = req.params;
            const newProducts=await productsService.deleteProduct(pid);
            return res.status(200).json(newProducts);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            return res.status(500).json({ status: 'error', message: 'Error al eliminar producto.' });
        }
    })

module.exports = router;