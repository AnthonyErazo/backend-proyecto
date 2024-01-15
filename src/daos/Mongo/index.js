const { ProductMongo } = require('./productsDaoMongo')
const { MessageMongo } = require('./messagesDaoMongo')
const { CartMongo } = require('./cartsDaoMongo')
const { UserMongo } = require('./userDaoMongo')

const productDaoInstance = new ProductMongo();
const messageDaoInstance = new MessageMongo();
const cartDaoInstance = new CartMongo();
const userDaoInstance = new UserMongo();

module.exports = {
    productsService: productDaoInstance,
    messageService: messageDaoInstance,
    cartsService: cartDaoInstance,
    usersService: userDaoInstance,
};