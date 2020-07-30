const nodeMailer = require('nodemailer');

function getConnection() {
  return nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    secureConnection: true,
  });
}

module.exports = {
  getMailConnection: () => getConnection(),
  sendSimpleMessage: (email, subject, message) => getConnection().sendMail({
    from: process.env.SMTP_USERNAME,
    to: email,
    subject,
    text: message,
  }),
};
