const { Router } = require('express');
const {CartMongo}=require('../daos/Mongo/cartsDaoMongo');

const router = Router();
const cartsService = new CartMongo();

router
    .get('/:cid',async (req,res)=>{
        try {
            const {cid}=req.params;
            let dataCart = await cartsService.getProductsByCartId(cid);
            return res.status(200).json(dataCart);
        } catch (error) {
            console.error('Error al obtener productos del carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al obtener productos del carrito.' });
        }
    })
    .post('/',async (req,res)=>{
        try {
            const newCart=await cartsService.createNewCart();
            return res.status(200).json(newCart);
        } catch (error) {
            console.error('Error al crear carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al crear carrito.' });
        }
    })
    .post('/:cid/product/:pid',async (req,res)=>{
        try {
            const{cid,pid}=req.params;
            const newCart=await cartsService.addProductByCartId(cid,pid);
            return res.status(200).json(newCart);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito.' });
        }
    })
    .delete('/:cid/products/:pid',async (req,res)=>{
        try {
            const{cid,pid}=req.params;
            const newCart=await cartsService.removeProductByCartId(cid,pid);
            return res.status(200).json(newCart);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito.' });
        }
    })
    .put('/:cid',async (req,res)=>{
        try {
            const updatedProducts=req.body;
            const{cid}=req.params;
            const newCart=await cartsService.updateProductsInCart(cid,updatedProducts);
            return res.status(200).json(newCart);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito.' });
        }
    })
    .put('/:cid/products/:pid',async (req,res)=>{
        try {
            const newQuantity=req.body;
            const{cid,pid}=req.params;
            const newCart=await cartsService.updateProductQuantity(cid,pid,newQuantity);
            return res.status(200).json(newCart);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito.' });
        }
    })
    .delete('/:cid',async (req,res)=>{
        try {
            const{cid}=req.params;
            const newCart=await cartsService.removeAllProductsByCartId(cid);
            return res.status(200).json(newCart);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito.' });
        } 
    })
module.exports=router;