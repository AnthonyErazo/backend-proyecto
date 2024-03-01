const { Server } = require('socket.io')
const { productsService,messageService }=require('../repositories')

//SOCKET IO
function socketIOfunction(httpServer) {
    const io = new Server(httpServer)
    io.on('connection', socket => {
        console.log('Nuevo cliente conectado');

        //REALTIMEPRODUCTS
        //Añadir productos en tiempo real
        socket.on('addProduct', async (data) => {
            try {
                await productsService.createProduct(data)
                const newProducts = await productsService.getProducts()
                io.emit('newProducts', newProducts.data)
            } catch (error) {
                console.error('Error al agregar producto:', error.message);
                socket.emit('error', { message: 'Error al agregar producto' });
            }
        })
        //Eliminar productos en tiempo real
        socket.on('eliminateProduct', async (id) => {
            try {
                await productsService.deleteProduct(id)
                const newProducts = await productsService.getProducts()
                io.emit('newProducts', newProducts.data)
            } catch (error) {
                console.error('Error al eliminar producto:', error.message);
                socket.emit('error', { message: 'Error al eliminar producto' });
            }
        })
        //CHAT
        //Añadir mensajes
        socket.on('message', async (data) => {
            await messageService.addMessage(data)
            const messages = await messageService.getMessages()
            io.emit('messageLogs', messages.data)
        })
        //Eliminar todos los mensajes
        socket.on('deleteAllMessages', async () => {
            await messageService.clearMessages()
            const messages = await messageService.getMessages()
            io.emit('messageLogs', messages.data)
        })

        
        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        })
    })
    return io
}
module.exports = socketIOfunction