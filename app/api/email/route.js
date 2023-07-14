import { NextResponse } from 'next/server';
import { addDays } from 'date-fns';
import dbConnect from '@/config/dbConnect';
import User from '@/models/user';
import Birthday from '@/models/birthday';
const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// Function to retrieve email data
async function getEmailData() {
  const emailData = [];
  dbConnect();
  const users = await User.find();
  for (const user of users) {
    const birthdays = await Birthday.find({ email: user.email });
    for (const birthday of birthdays) {
      const birthdayDate = new Date(birthday.date);
      const formattedDate = birthdayDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      const data = {
        birthdayName: birthday.name,
        birthdayDate: formattedDate,
        gifts: birthday.gifts,
        userName: user.name,
        userEmail: user.email,
      };
      emailData.push(data);
    }
  }
  return emailData;
}

// Function to send the email
async function sendEmails(emailData) {
  for (const data of emailData) {
    const { birthdayName, birthdayDate, gifts, userName, userEmail } = data;
    await sendgrid.send({
      to: userEmail,
      from: process.env.MY_EMAIL,
      subject: `Birthday Reminder: ${birthdayName}'s birthday is coming up!`,
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #whitesmoke;
                color: #333;
              }
              h1 {
                color: #ff5500;
              }
              p {
                font-size: 16px;
                line-height: 1.5;
              }
            </style>
          </head>
          <body>
            <h1>Dear ${userName},</h1>
            <p>Just a reminder that ${birthdayName}'s birthday is coming up on ${birthdayDate}.</p>
            <p>Don't forget to wish ${birthdayName} a happy birthday!</p>
            <p>Here are some gift ideas: ${gifts.join(',')}.</p>
          </body>
        </html>
      `,
    });
  }
}

export async function GET(req, res) {
  await dbConnect();
  const users = await User.find();
  for (const user of users) {
    if (!user.receiveEmailNotification) {
      continue;
    }
    const birthdays = await Birthday.find({ email: user.email });
    for (const birthday of birthdays) {
      const birthdayDate = new Date(birthday.date);
      const notificationDate = addDays(birthdayDate, -user.notificationDays);
      const today = new Date();
      if (
        today.getDate() === notificationDate.getDate() &&
        today.getMonth() + 1 === notificationDate.getMonth() + 1
      ) {
        const formattedDate = birthdayDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        // Uncomment the code block to send emails
        const response = await sendgrid.send({
          to: user.email,
          from: process.env.MY_EMAIL,
          subject: `Birthday Reminder: ${birthday.name}'s birthday is coming up!`,
          html: `
            <html>
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #whitesmoke;
                    color: #333;
                  }
                  h1 {
                    color: #ff5500;
                  }
                  p {
                    font-size: 16px;
                    line-height: 1.5;
                  }
                </style>
              </head>
              <body>
                <h1>Dear ${user.name},</h1>
                <p>Just a reminder that ${
                  birthday.name
                }'s birthday is coming up on ${formattedDate}.</p>
                <p>Don't forget to wish ${birthday.name} a happy birthday!</p>
                <p>Here are some gift ideas: ${birthday.gifts.join(',')}.</p>
              </body>
            </html>
            `,
        });
      }
    }
  }
}