const nodemailer = require('nodemailer')
const { configObject } = require('../config')

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.Gmail_user_app,
        pass: configObject.Gmail_pass_app
    }
})

exports.sendMail = async (destino, subject, html) => {
    return await transport.sendMail({
        from: 'Este mail lo envia <anthonyerazo76@gmail.com>',
        to: destino,
        subject,
        html
    })
}