const { connect } = require('mongoose')

exports.connectDb = async () => {
    await connect('mongodb+srv://anthonyerazo76:anthonyerazo76@cluster0.gzll4u2.mongodb.net/ecommerce?retryWrites=true&w=majority')
    console.log('Base de datos conectada')
}


const session = require('express-session');
const MongoStore = require('connect-mongo');

exports.sessionsMdb = (app) => {
    app.use(
        session({
            // store: MongoStore.create({
            //     mongoUrl: 'mongodb+srv://anthonyerazo76:anthonyerazo76@cluster0.gzll4u2.mongodb.net/ecommerce?retryWrites=true&w=majority',
            //     ttl: 3000,
            // }),
            secret: 'p@l@br@seCret@',
            resave: true,
            saveUninitialized: true,
        })
    );
};