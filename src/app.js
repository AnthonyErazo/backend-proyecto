const ProductManager = require('./productManager');
const express=require("express");
const app=express();
const port=8080;
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const products = new ProductManager();

app.get("/products",async (req,res)=>{
    try {
        const limit=req.query.limit;
        let dataProducts = await products.getProducts();
        if(!!limit)dataProducts = dataProducts.slice(0, parseInt(limit));
        return res.status(200).json({ status: 'ok', data: dataProducts });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return res.status(500).json({ status: 'error', message: 'Error al obtener productos.' });
    }
});
app.get("/products/:id",async (req,res)=>{
    try {
        const id=req.params.id;
        let dataProducts = await products.getProductById(id);
        return res.status(200).json({ status: 'ok', data: dataProducts });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return res.status(500).json({ status: 'error', message: 'Error al obtener productos.' });
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});