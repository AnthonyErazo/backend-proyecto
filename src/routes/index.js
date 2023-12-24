const { Router } = require('express')
const productRouter = require('./products.router.js')
const cartRouter = require('./carts.router.js')
const viewsRouter = require('./views.router.js')
const { uploader } = require('../utils/uploader.js')

const router = Router();

router.post('/uploader', uploader.single('myFile'), (req, res)=>{

    res.send('Imagen subida')
})

router.use('/', viewsRouter);
router.use('/api/products', productRouter);
router.use('/api/carts', cartRouter);


router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error de server');
});

module.exports = router