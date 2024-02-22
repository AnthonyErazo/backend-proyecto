class MessageRepository {
    constructor(dao){
        this.dao = dao
    }

    addMessage   = async (newMessage) => await this.dao.add(newMessage)
    getMessages    = async () => await this.dao.get()
    clearMessages = async () => await this.dao.clear()

}

module.exports = MessageRepository