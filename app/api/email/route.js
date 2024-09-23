import { NextResponse } from 'next/server';
import { addDays } from 'date-fns';
import dbConnect from '@/config/dbConnect';
import User from '@/models/user';
import Birthday from '@/models/birthday';
const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export async function GET(req) {
  await dbConnect();
  const users = await User.find();
  
  // Track if any email was sent
  let emailSent = false;
  
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
        today.getMonth() === notificationDate.getMonth()
      ) {
        const formattedDate = birthdayDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        });

        try {
          await sendgrid.send({
            to: user.email,
            from: process.env.MY_EMAIL,
            subject: `Birthday Reminder: ${birthday.name}'s birthday is coming up!`,
            html: `
              <html>
                <head>
                  <style>
                    body {
                      background-color: #whitesmoke;
                      color: #333;
                    }
                    h1 {
                      color: #F87474;
                      font-size: 24px;
                      margin-bottom: 16px;
                    }
                    p {
                      font-size: 16px;
                      line-height: 1.5;
                      margin-bottom: 12px;
                      color: #187498;
                    }
                    .signature {
                      font-size: 14px;
                      color: #888;
                      margin-top: 32px;
                    }
                  </style>
                </head>
                <body>
                  <h1>Dear ${user.name},</h1>
                  <p>Just a reminder that ${birthday.name}'s birthday is coming up on ${formattedDate}.</p>
                  <p>Don't forget to wish ${birthday.name} a happy birthday!</p>
                  <p>Here are some gift ideas: ${birthday.gifts.join(',')}.</p>
                  <p class="signature">Best,<br>The Birthday Reminder team</p>
                </body>
              </html>
              `,
          });

          // Mark that an email was sent
          emailSent = true;
        } catch (error) {
          return new NextResponse('Failed to send email', { status: 500 });
        }
      }
    }
  }

  // If no email was sent, return a different response
  if (!emailSent) {
    return new NextResponse('No emails to send today', { status: 200 });
  }

  return new NextResponse('All emails sent successfully', { status: 200 });
}
