const {productsService}=require('../daos/Mongo');

class ProductsController{
    constructor(){
        this.service=productsService
    }
    getProducts=async (req, res) => {
        try {
            const { limit=10,page=1,sort,query } = req.query;
            const dataProducts = await this.service.getProducts(limit,page,sort,query);
            return res.status(200).json(dataProducts);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor', error:error.message });
        }
    }
    getProductById=async (req, res) => {
        try {
            const { pid } = req.params;
            let dataProducts = await this.service.getProductById(pid);
            return res.status(200).json(dataProducts);
        } catch (error) {
            console.error('Error al obtener producto.', error);
            return res.status(500).json({ status: 'error', message: 'Error al obtener producto.', error:error.message });
        }
    }
    addProduct=async (req, res) => {
        try {
            const product = req.body;
            newProducts=await this.service.addProduct(product);
            return res.status(200).json(newProducts);
        } catch (error) {
            console.error('Error al insertar producto:', error);
            return res.status(500).json({ status: 'error', message: 'Error al insertar producto.', error:error.message });
        }
    }
    updateProduct=async (req, res) => {
        try {
            const product = req.body;
            const { pid } = req.params;
            const newProducts=await this.service.updateProduct(pid, product);
            return res.status(200).json(newProducts);
        } catch (error) {
            console.error('Error al modificar producto:', error);
            return res.status(500).json({ status: 'error', message: 'Error al modificar producto.', error:error.message });
        }
    }
    deleteProduct= async (req, res) => {
        try {
            const { pid } = req.params;
            const newProducts=await this.service.deleteProduct(pid);
            return res.status(200).json(newProducts);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            return res.status(500).json({ status: 'error', message: 'Error al eliminar producto.', error:error.messageb });
        }
    }
}

module.exports=ProductsController