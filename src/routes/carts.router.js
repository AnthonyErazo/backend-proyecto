const { Router } = require('express');
const {CartMongo}=require('../daos/Mongo/cartsDaoMongo');

const router = Router();
const cartsService = new CartMongo();

router
    .get('/:cid',async (req,res)=>{
        try {
            const {cid}=req.params;
            let dataCart = await cartsService.getProductsByCartId(cid);
            if(dataCart.success){
                return res.status(200).json(dataCart);
            }else{
                return res.status(404).json(dataCart);
            }
        } catch (error) {
            console.error('Error al obtener productos del carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al obtener productos del carrito.' });
        }
    })
    .post('/',async (req,res)=>{
        try {
            const newCart=await cartsService.createNewCart();
            if(newCart.success){
                return res.status(200).json(newCart);
            }else{
                return res.status(404).json(newCart);
            }
        } catch (error) {
            console.error('Error al crear carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al crear carrito.' });
        }
    })
    .post('/:cid/product/:pid',async (req,res)=>{
        try {
            const{cid,pid}=req.params;
            const newCart=await cartsService.addProductByCartId(cid,pid);
            if(newCart.success){
                    return res.status(200).json(newCart);
            }else{
                return res.status(404).json(newCart);
            }
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito.' });
        }
    })
module.exports=router;