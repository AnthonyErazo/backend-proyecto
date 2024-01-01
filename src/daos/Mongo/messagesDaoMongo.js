const { messageModel } = require('./models/messages.model.js');

class MessageDaoMongo {
    constructor() {
        this.model = messageModel
    }

    async addMessage(newMessage) {
        const createdMessage = await this.model.create(newMessage);
        return { success: true, data: createdMessage, message: 'Mensaje agregado correctamente.' };

    }

    async getMessages() {
        const messages = await this.model.find({}).lean();
        return { success: true, data: messages };

    }

    async clearMessages() {
        const result = await this.model.deleteMany({});
        return { success: true, message: 'Mensajes borrados correctamente.', data: result };

    }
}

exports.MessageMongo = MessageDaoMongo;