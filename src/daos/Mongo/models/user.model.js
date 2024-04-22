const { Schema, model } = require('mongoose')
const mongososePaginate = require('mongoose-paginate-v2')

const usersSchema = Schema({
    first_name: { type: String, required: true },
    last_name: String,
    email: { type: String, required: true, unique: true },
    birthdate:{type:Date},
    password: String ,
    cart:{type:Schema.Types.ObjectId,ref:'carts'},
    role: { type: String, enum: ['user', 'premium', 'admin'], default: 'user' },
    documents:{ type: [
        {
            name: {type: String},
            reference: {type: String}
        }
    ]},
    last_connection: { type: Date, default: null }
})


usersSchema.pre('find',function () {
    this.populate('cart')
})

usersSchema.plugin(mongososePaginate)

exports.usersModel = model('usuarios', usersSchema)