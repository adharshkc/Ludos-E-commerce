const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'adharshkc2017@gmail.com',
        pass: 'zooa futh kutl tfbg'
    }
})

module.exports = transporter;