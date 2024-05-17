const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
    user: { type: String, required: true },
    message: { type: String },
})

const messageModel = model('messages', messageSchema);

module.exports = {
    messageModel
}