const { Router } = require('express');
const managers = require('../managers/index');
const cartsService = managers.cartManager;
const router = Router();

router
    .get('/:cid',async (req,res)=>{
        try {
            const {cid}=req.params;
            let dataCart = await cartsService.getProductsByCartId(cid);
            return res.status(200).json({ status: 'ok', data: dataCart });
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
            const newCart=await cartsService.addProductByCartId(cid,pid);
            let dataCart = await cartsService.getProductsByCartId(newCart);
            return res.status(200).json({ status: 'ok', data: dataCart });
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito.' });
        }
    })
module.exports=router;