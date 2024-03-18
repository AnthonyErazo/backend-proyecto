const { sendMail } = require("../utils/sendMail")

class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    getTickets = async (limit, page) => await this.dao.get(limit, page)
    getTicket = async (filter) => await this.dao.getBy(filter)
    createTicket = async (cid,cart, email) => {
        const ticket= await this.dao.create(cart, email)
        await this.service.updateProductsInCart(cid, ticket.productsNotProcessed);
        const to = ticket.payload.purchaser
        const subject = 'Tickect generado'
        const html = `<div>
                    <h2>Resumen de la compra</h2>
                    <p>codigo de ticket: ${ticket.payload.code}</p>
                    <p>total: ${ticket.payload.amount}</p>
                    <p>fecha de pago: ${ticket.payload.purchase_datetime}</p>
                </div>`
        sendMail(to, subject, html)
        return ticket
    }

}

module.exports = TicketRepository