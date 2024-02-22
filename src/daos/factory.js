let ProductsDao
let MessagesDao
let UserDao
let CartsDao
let TicketDao

switch ('MONGO') {
    case 'FILE':
        //importa el dao de las entidades con persistencia en archivo
        break;
    case 'MEMORY':
        //importa el dao de las entidades con persistencia en memoria
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