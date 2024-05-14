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
const jwt = require('jsonwebtoken');
const { configObject } = require('../config/configObject.js')
const { isUserOrPremium, isUser } = require('../middleware/verifiqueRole.middleware.js')

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
router.get('/extractToken', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    try {
        const decodedToken = jwt.verify(token, configObject.Jwt_private_key);
        res.req.user=decodedToken
        res.json(decodedToken);
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
});

router.use('/api/products', productRouter);
router.use('/api/carts', isUserOrPremium,cartRouter);
router.use('/api/sessions', sessionRouter);
router.use('/api/users', userRouter);
router.use('/pruebas', pruebasRouter);

module.exports = router