let ProductsDao
let MessagesDao
let UserDao
let CartsDao
let TicketDao

switch ('MONGO') {
    case 'FILE':
        const {ProductManager} = require("./File/managers/productManager");
        const {CartManager} = require("./File/managers/cartsManager");
        ProductsDao = ProductManager
        CartsDao = CartManager
        break;
    case 'MEMORY':
        break;
    default:
        const {ProductMongo} = require("./Mongo/productsDaoMongo");
        const {MessageMongo} = require("./Mongo/messagesDaoMongo");
        const {UserMongo} = require("./Mongo/userDaoMongo");
        const {CartMongo} = require("./Mongo/cartsDaoMongo");
        const {TicketMongo} = require("./Mongo/ticketDaoMongo");
        ProductsDao = ProductMongo
        MessagesDao = MessageMongo
        UserDao = UserMongo
        CartsDao = CartMongo
        TicketDao=TicketMongo
        break;
}

module.exports = {
    ProductsDao,
    MessagesDao,
    UserDao,
    CartsDao,
    TicketDao
}