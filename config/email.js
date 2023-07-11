import nodemailer from 'nodemailer';

const email = nodemailer.createTransport({
    service: 'SendGrid',
    port: 587,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
    }
})

export default email;

