const { messageModel } = require('./models/messages.model.js');

class MessageDaoMongo {
    constructor() {
        this.model = messageModel
    }

    async addMessage(newMessage) {
        try {
            const createdMessage = await this.model.create(newMessage);
            return { success: true, data: createdMessage, message: 'Mensaje agregado correctamente.' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al agregar el mensaje.', error: error.message };
        }
    }

    async getMessages() {
        try {
            const messages = await this.model.find({}).lean();
            return { success: true, data: messages };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al obtener los mensajes.', error: error.message };
        }
    }

    async clearMessages() {
        try {
            const result = await this.model.deleteMany({});
            return { success: true, message: 'Mensajes borrados correctamente.', data: result };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al borrar los mensajes.', error: error.message };
        }
    }
}

exports.MessageMongo = MessageDaoMongo;