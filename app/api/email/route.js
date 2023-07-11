import { NextResponse } from 'next/server';
import { addDays} from 'date-fns';
import dbConnect from '@/config/dbConnect';
import User from '@/models/user';
import Birthday from '@/models/birthday';
import email from '@/config/email';

async function handler(req, res) {
  try {
    dbConnect();
    const users = await User.find();
    for (const user of users) {
      if (!user.receiveEmailNotification) {
        continue;
      }

      const birthdays = await Birthday.find({email: user.email})
      console.log(birthdays);
      for (const birthday of birthdays) {
        const birthdayDate = new Date (birthday.date);
        const notificationDate = addDays(birthdayDate, -user.notificationDays);
        notificationDate.setUTCHours(6,0,0,0);
        const today = new Date();
        today.setUTCHours(6,0,0,0);
        console.log(notificationDate, today);
        if (today.getDate() !== notificationDate.getDate() ||
        today.getMonth() !== notificationDate.getMonth()) {
          continue;
        }
        const formattedDate = birthdayDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        const unsubscribeUrl = `/birthdays/set-notifications`;
        const msg = {
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
              <p>Just a reminder that ${birthday.name}'s birthday is coming up on ${formattedDate}.</p>
              <p>Don't forget to wish ${birthday.name} a happy birthday!</p>
              <p>Here are some gift ideas: ${birthday.gifts.join(',')}.</p>
              <p>If you no longer wish to receive these reminder emails, you can <a href="${unsubscribeUrl}">unsubscribe here</a>.</p>
            </body>
          </html>
        `,
        }

        await email.sendMail(msg);
        
      }
    }
    // Email sent successfully
    return new NextResponse('Emails sent succesfully', { status: 200 });
  } catch (error) {
    // Handle errors
    return new NextResponse('Failed to send email', { status: 500 });
  }
}
export {handler as GET};
