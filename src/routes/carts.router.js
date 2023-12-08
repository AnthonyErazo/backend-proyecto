const { Router } = require('express');
const CartManager = require('../managers/cartsManager.js');
const ProductManager = require('../managers/productManager.js');
const cartsService=new CartManager();
const productsService=new ProductManager();
const router = Router();

router
    .get('/:cid',async (req,res)=>{
        try {
            const {cid}=req.params;
            let dataCart = await cartsService.getProductsByCartId(cid);
            if (dataCart !== null) {
                const productDetail=await productsService.getProductsDetails(dataCart);
                return res.status(200).json({ status: 'ok', data: productDetail });
            } else {
                return res.status(404).json({ status: 'error', message: 'Carrito no encontrado.' });
            }
        } catch (error) {
            console.error('Error al obtener productos del carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al obtener productos del carrito.' });
        }
    })
    .post('/',async (req,res)=>{
        try {
            const newCart=await cartsService.createNewCart();
            return res.status(200).json({ status: 'ok', data: newCart });
        } catch (error) {
            console.error('Error al crear carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al crear carrito.' });
        }
    })
    .post('/:cid/product/:pid',async (req,res)=>{
        try {
            const{cid,pid}=req.params;
            await cartsService.addProductByCartId(cid,pid);
            return res.status(200).json({ status: 'ok', data: [] });
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito.' });
        }
    })
module.exports=router;