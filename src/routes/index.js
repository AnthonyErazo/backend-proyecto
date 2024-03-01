const { Router } = require('express')
const productRouter = require('./products.router.js')
const cartRouter = require('./carts.router.js')
const sessionRouter = require('./sessions.router.js')
const viewsRouter = require('./views.router.js')
const pruebasRouter = require('./pruebas.router.js')
const { uploader } = require('../utils/uploader.js')
const { extractTokenData } = require('../middleware/extractTokenData.middleware.js')
const { handleError } = require('../utils/error/handleError.js')

const router = Router();

router.post('/uploader', uploader.single('myFile'), (req, res)=>{

    res.send('Imagen subida')
})

//RUTAS
router.use('/',extractTokenData,viewsRouter);
router.use('/api/products', productRouter);
router.use('/api/carts', cartRouter);
router.use('/api/sessions', sessionRouter);
router.use('/pruebas', pruebasRouter);


router.use(handleError)

module.exports = router