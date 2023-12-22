const { Router } = require('express');
const {ProductMongo}=require('../daos/Mongo/productsDaoMongo');

const router = Router();
const productsService =  new ProductMongo();

function formatResponse(data) {
    return JSON.stringify(data, null, 2);
}

router
    .get('/', async (req, res) => {
        try {
            const { limit, ...otherParams } = req.query;
            if (Object.keys(otherParams).length > 0 || (limit !== undefined && isNaN(parseInt(limit)))) return res.status(200).json({ status: 'ok', data: [] });
            const dataProducts = await productsService.getProducts();
            if (dataProducts.success) {
                if (limit === undefined || isNaN(parseInt(limit))) {
                    return res.status(200).json(dataProducts);
                } else {
                    const limitedProducts = dataProducts.data.slice(0, parseInt(limit));
                    return res.status(200).json({ success: true, data: limitedProducts });
                }
            } else {
                return res.status(404).json(dataProducts);
            }
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }

    })
    .get('/:pid', async (req, res) => {
        try {
            const { pid } = req.params;
            let dataProducts = await productsService.getProductById(pid);
            if (dataProducts.success) {
                return res.status(200).json(dataProducts);
            } else {
                return res.status(404).json(dataProducts);
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
            if(newProducts.success){
                return res.status(200).json(newProducts);
            }else{
                return res.status(404).json(newProducts);
            }
            
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
            if(newProducts.success){
                return res.status(200).json(newProducts);
            }else{
                return res.status(404).json(newProducts);
            }
        } catch (error) {
            console.error('Error al modificar producto:', error);
            return res.status(500).json({ status: 'error', message: 'Error al modificar producto.' });
        }
    })
    .delete('/:pid', async (req, res) => {
        try {
            const { pid } = req.params;
            const newProducts=await productsService.deleteProduct(pid);
            if(newProducts.success){
                return res.status(200).json(newProducts);
            }else{
                return res.status(404).json(newProducts);
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            return res.status(500).json({ status: 'error', message: 'Error al eliminar producto.' });
        }
    })

module.exports = router;