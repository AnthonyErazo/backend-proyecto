const { connect } = require('mongoose')

exports.connectDb = async () => {
    await connect('mongodb+srv://anthonyerazo76:anthonyerazo76@cluster0.gzll4u2.mongodb.net/ecommerce?retryWrites=true&w=majority')
    console.log('Base de datos conectada')
}