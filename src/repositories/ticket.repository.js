class TicketRepository {
    constructor(dao){
        this.dao = dao
    }

    getTickets   = async (limit,page) => await this.dao.get(limit,page)
    getTicket   = async (filter) => await this.dao.getBy(filter)
    createTicket = async (cart) => await this.dao.create(cart)

}

module.exports = TicketRepository