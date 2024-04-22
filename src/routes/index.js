const { Router } = require('express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')
const productRouter = require('./products.router.js')
const cartRouter = require('./carts.router.js')
const sessionRouter = require('./sessions.router.js')
const viewsRouter = require('./views.router.js')
const pruebasRouter = require('./pruebas.router.js')
const userRouter = require('./user.router.js')
const { uploader } = require('../utils/uploader.js')
const { extractTokenData } = require('../middleware/extractTokenData.middleware.js')

const router = Router();

router.post('/uploader', uploader.single('file'), (req, res)=>{
    res.send('Imagen subida')
})
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de app',
            description: 'Api Docs'
        }
    },
    apis: [`${__dirname}/../docs/*.yaml`]
}

const specs = swaggerJsDoc(swaggerOptions)

router.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))


//RUTAS
router.use('/',extractTokenData,viewsRouter);
router.use('/api/products', productRouter);
router.use('/api/carts', cartRouter);
router.use('/api/sessions', sessionRouter);
router.use('/api/users', userRouter);
router.use('/pruebas', pruebasRouter);

module.exports = router