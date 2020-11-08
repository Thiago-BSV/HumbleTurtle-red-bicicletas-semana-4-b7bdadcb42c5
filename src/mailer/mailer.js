const nodemailer = require('nodemailer');

const mailConfig = {
    host: process.env.SMTP_URI,
    port: process.env.SMTP_PORT,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
}

module.exports = nodemailer.createTransport(mailConfig);