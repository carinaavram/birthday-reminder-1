import { addDays } from 'date-fns';
import dbConnect from '@/config/dbConnect';
import User from '@/models/user';
import Birthday from '@/models/birthday';
import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export async function GET(res, req) {
  try {
    dbConnect();
    const users = await User.find();
    for (const user of users) {
      if (!user.receiveEmailNotification) {
        continue;
      }

      const birthdays = await Birthday.find({ email: user.email });
      for (const birthday of birthdays) {
        const birthdayDate = new Date(birthday.date);
        const notificationDate = addDays(birthdayDate, -user.notificationDays);
        notificationDate.setUTCHours(6, 0, 0, 0);
        const today = new Date();
        today.setUTCHours(6, 0, 0, 0);
        if (
          today.getDate() !== notificationDate.getDate() ||
          today.getMonth() !== notificationDate.getMonth()
        ) {
          continue;
        }
        const formattedDate = birthdayDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        await sendgrid.send(
          {
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
          },
          function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent ' + info);
            }
          }
        );
        console.log('Email sent successfully for user:', user.email);
      }
    }
    // Email sent successfully
    res.status(200).json('Emails sent successfully!');
  } catch (error) {
    console.error('Error sending emails:', error);
    // Handle errors
    res.status(500).json('Failed to send email');
  }
}
