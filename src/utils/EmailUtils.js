'use strict';

const nodeMailer = require('nodemailer');

module.exports = {
    getMailConnection: () => getConnection(),
    sendSimpleMessage: (email, subject, message) => getConnection().sendMail({
        from: process.env.SMTP_USERNAME,
        to: email,
        subject: subject,
        text: message
    }),
};

function getConnection() {
    return nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        },
        secureConnection: true
    });
}