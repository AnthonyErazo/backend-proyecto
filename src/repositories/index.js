
const { ProductsDao, UserDao, CartsDao, MessagesDao,TicketDao } = require("../daos/factory.js");
const CartRepository = require("./carts.repository.js");
const MessageRepository = require("./message.repository.js");
const ProductsRepository = require("./products.repository.js");
const TicketRepository = require("./ticket.repository.js");
const UserRepository = require("./user.repository.js");


const productsService = new ProductsRepository(new ProductsDao)
const userService=new UserRepository(new UserDao)
const cartsService=new CartRepository(new CartsDao)
const messageService=new MessageRepository(new MessagesDao)
const ticketService=new TicketRepository(new TicketDao)

module.exports = {
    productsService,
    userService,
    cartsService,
    messageService,
    ticketService
}