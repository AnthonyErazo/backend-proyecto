const express = require('express');
const handlebars = require('express-handlebars')
const appRouter = require('./routes')
const { Server } = require('socket.io')
const {connectDb} = require('./config')

const managers = require('./managers')
const productService = managers.productManager;


const app = express()
const PORT = 8080

connectDb()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
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
            io.emit('newProducts', newProducts)
        } catch (error) {
            throw Error(error);
        }
    })
    socket.on('eliminateProduct', async (id) => {
        try {
            await productService.deleteProduct(id)
            const newProducts = await productService.getProducts()
            io.emit('newProducts', newProducts)
        } catch (error) {
            throw Error(error);
        }
    })
    socket.on('disconnect', ()=>{
        console.log('Cliente desconectado');
    })
})