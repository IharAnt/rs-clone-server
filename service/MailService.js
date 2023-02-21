const nodemailer = require('nodemailer');

class Mailervice {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  async sendActivationMail(to, link) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: to,
      subject: 'Activate your account',
      html: `
        <h1>Activate your account</h1>
        <p>Please click on the following link to activate your account:</p>
        <p><a href="${link}">${link}</a></p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

module.exports = new Mailervice();
