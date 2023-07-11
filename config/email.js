import nodemailer from 'nodemailer';

const email = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
    }
})

export default email;

