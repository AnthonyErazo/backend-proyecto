const { ObjectId } = require('mongoose').Types;
const { ticketModel } = require('./models/ticket.model')
const { productModel } = require('./models/products.model')
const { usersModel } = require('./models/user.model')

function generateUniqueCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 8;
    let code = '';
    for (let i = 0; i < codeLength; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

class TicketDaoMongo {
    constructor() {
        this.model = ticketModel
        this.modelProduct=productModel
        this.modelUser=usersModel
    }

    async get(limit = -1, page = 1) {

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true,
        };

        const { docs: payload, ...rest } = await this.model.paginate(options);

        if (payload.length > 0) {
            return {
                status: "success",
                payload,
                ...rest,
                prevLink: rest.hasPrevPage ? `/products?limit=${limit}&page=${rest.prevPage}` : null,
                nextLink: rest.hasNextPage ? `/products?limit=${limit}&page=${rest.nextPage}` : null,
            };
        } else {
            throw new Error('No hay tickets disponibles');
        }
    };

    async getBy(filter) {
        const ticket = await this.model.findOne(filter).lean();

        if (ticket) {
            return { status: "success", payload: ticket };
        } else {
            throw new Error(`Ticket no encontrado`)
        }

    };
    async create(cart) {
        const CartData = cart.data;
        if (CartData.products.length === 0) {
            throw Error('El carrito está vacío')
        }
        const productsNotProcessed = [];
        let totalPrice = 0;

        for (const product of CartData.products) {
            const { product: existingProduct, quantity } = product;

            if (existingProduct && existingProduct.stock >= quantity) {
                totalPrice += (quantity * existingProduct.price);
                existingProduct.stock -= quantity;
                await this.modelProduct.findOneAndUpdate({ _id: new ObjectId(existingProduct._id) }, existingProduct)
            } else {
                productsNotProcessed.push({product:new ObjectId(existingProduct._id),quantity});
            }
        }
        if(totalPrice==0){
            throw Error("No se pudo completar la compra, verificar stock");
        }
        const {email} = await this.modelUser.findOne({cart:CartData._id}).select('-password');
        const ticketData = {
            code: generateUniqueCode(),
            purchase_datetime: new Date(),
            amount: totalPrice,
            purchaser: email,
        };
        const ticket = await this.model.create(ticketData);
        return { status: "success", payload: ticket, productsNotProcessed };

    }
}


exports.TicketMongo = TicketDaoMongo;