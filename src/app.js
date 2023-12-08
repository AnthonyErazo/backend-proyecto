const express = require('express');
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')

const viewsRouter = require('./routes/views.router.js')
const productsRouter = require('./routes/products.router.js');
const cartsRouter=require('./routes/carts.router.js');

const app=express();
const PORT = 8080 || process.env.PORT


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.use('/', viewsRouter)
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);
app.use(( err, req, res, next)=>{
    console.error(err.stack)
    res.status(500).send('error de server')
})

const httpServer = app.listen(PORT, err =>{
    if (err)  console.log(err)
    console.log(`Escuchando en el puerto ${PORT}`)
})
const io = new Server(httpServer)
let messagesArray = []
io.on('connection', socket => {
    console.log('Nuevo cliente conectado')

    socket.on('message', data => {
        messagesArray.push(data)
        io.emit('messageLogs', messagesArray)
    })
})