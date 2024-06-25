const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'adharshkc2017@gmail.com',
        pass: process.env.APP_PASS
    }
})

module.exports = transporter;
