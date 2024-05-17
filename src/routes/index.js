const { Router } = require('express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')
const productRouter = require('./products.router.js')
const cartRouter = require('./carts.router.js')
const sessionRouter = require('./sessions.router.js')
const viewsRouter = require('./views.router.js')
const pruebasRouter = require('./pruebas.router.js')
const userRouter = require('./user.router.js')
const { uploader, uploadToFirebase,uploaderFirebase } = require('../utils/uploader.js')
const { extractTokenData } = require('../middleware/extractTokenData.middleware.js')
const jwt = require('jsonwebtoken');
const { configObject } = require('../config/configObject.js')
const { isUserOrPremium } = require('../middleware/verifiqueRole.middleware.js')

const router = Router();

router.post('/uploader', uploader.array('file'), (req, res)=>{
    try {
        const uploadedFiles = req.files.map(file => ({
            originalName: file.originalname,
            filePath: file.path
        }));
        res.json({ payload:uploadedFiles });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error al subir las imágenes' });
    }
})
router.post('/upload-to-firebase',uploaderFirebase.array('file'), async (req, res) => {
    try {
        const files = req.files;
        let urls = [];
        
        for (const file of files) {
            const url = await uploadToFirebase(file);
            urls=[...urls,url[0]]
        }

        res.json({ urls });
    } catch (error) {
        console.error('Error al subir la imagen a Firebase:', error);
        res.status(500).json({ message: 'Error al subir la imagen a Firebase' });
    }
});
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