const express = require('express');
const handlebars = require('express-handlebars')
const appRouter = require('./routes')
const { Server } = require('socket.io')
const { connectDb, sessionsMdb } = require('./config')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const { initializePassport } = require('./config/passport.config.js')

const { ProductMongo } = require('./daos/Mongo/productsDaoMongo');
const productService = new ProductMongo();
const { MessageMongo } = require('./daos/Mongo/messagesDaoMongo');
const { usersService } = require('./daos/Mongo/index.js');
const messageService = new MessageMongo();


const app = express()
const PORT = 8080


connectDb()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(cookieParser('p@l@br@seCret@'))

sessionsMdb(app)

initializePassport()
app.use(passport.initialize())

app.use(async (req, res, next) => {
    try {
        if (req.cookies.token) {
            passport.authenticate('jwt', { session: false }, (err, user) => {
                if (err || !user) {
                    return next(err);
                }
                res.locals.currentUser = user;
                next();
            })(req, res, next);
        } else {
            next();
        }
    } catch (error) {
        next(error);
    }
});

app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    allowProtoPropertiesByDefault:true,
    allowProtoMethodsByDefault:true,
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')


app.use(appRouter)

const httpServer = app.listen(PORT, err => {
    if (err) console.log(err)
    console.log(`Escuchando en el puerto ${PORT}`)
})

const io = new Server(httpServer)
io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('addProduct', async (data) => {
        try {
            await productService.addProduct(data)
            const newProducts = await productService.getProducts()
            io.emit('newProducts', newProducts.data)
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
            socket.emit('error', { message: 'Error al agregar producto' });
        }
    })
    socket.on('eliminateProduct', async (id) => {
        try {
            await productService.deleteProduct(id)
            const newProducts = await productService.getProducts()
            io.emit('newProducts', newProducts.data)
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
            socket.emit('error', { message: 'Error al eliminar producto' });
        }
    })
    socket.on('message', async (data) => {
        await messageService.addMessage(data)
        const messages=await messageService.getMessages()
        io.emit('messageLogs', messages.data)
    })
    socket.on('deleteAllMessages', async () => {
        await messageService.clearMessages()
        const messages=await messageService.getMessages()
        io.emit('messageLogs', messages.data)
    })
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    })
})