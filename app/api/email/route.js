import { NextResponse } from 'next/server';
import { addDays } from 'date-fns';
import dbConnect from '@/config/dbConnect';
import User from '@/models/user';
import Birthday from '@/models/birthday';
import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(`${process.env.SENDGRID_API_KEY}`);

// Function to retrieve email data
// async function getEmailData() {
//   const emailData = [];
//   dbConnect();
//   const users = await User.find();
//   for (const user of users) {
//     const birthdays = await Birthday.find({ email: user.email });
//     for (const birthday of birthdays) {
//       const birthdayDate = new Date(birthday.date);
//       const formattedDate = birthdayDate.toLocaleDateString('en-US', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//       });

//       const data = {
//         birthdayName: birthday.name,
//         birthdayDate: formattedDate,
//         gifts: birthday.gifts,
//         userName: user.name,
//         userEmail: user.email,
//       };
//       emailData.push(data);
//     }
//   }
//   return emailData;
// }

// // Function to send the email
// async function sendEmails(emailData) {
//   for (const data of emailData) {
//     const { birthdayName, birthdayDate, gifts, userName, userEmail } = data;
//     await sendgrid.send({
//       to: userEmail,
//       from: process.env.MY_EMAIL,
//       subject: `Birthday Reminder: ${birthdayName}'s birthday is coming up!`,
//       html: `
//         <html>
//           <head>
//             <style>
//               body {
//                 font-family: Arial, sans-serif;
//                 background-color: #whitesmoke;
//                 color: #333;
//               }
//               h1 {
//                 color: #ff5500;
//               }
//               p {
//                 font-size: 16px;
//                 line-height: 1.5;
//               }
//             </style>
//           </head>
//           <body>
//             <h1>Dear ${userName},</h1>
//             <p>Just a reminder that ${birthdayName}'s birthday is coming up on ${birthdayDate}.</p>
//             <p>Don't forget to wish ${birthdayName} a happy birthday!</p>
//             <p>Here are some gift ideas: ${gifts.join(',')}.</p>
//           </body>
//         </html>
//       `,
//     });
//   }
// }

export async function GET(req, res) {
  try {
    // const emailDataPromise = getEmailData();
    // const timeoutPromise = new Promise((resolve) =>
    //   setTimeout(resolve, 10000, null) // Resolves the promise after 10 seconds
    // );

    // const emailData = await Promise.race([emailDataPromise, timeoutPromise]);

    // if (!emailData) {
    //   console.log('Timeout occurred');
    //   return new NextResponse(
    //     JSON.stringify({ message: 'Timeout occurred', status: 500 })
    //   );
    // }

    await sendgrid.send({
      to: 'carinaavram97@gmail.com',
      from: `${process.env.MY_EMAIL}`,
      subject: 'Test Email',
      html: '<h1>This is a test</h1>'
    });

    // Emails sent successfully
    return new NextResponse('Emails sent successfully!', {status: 200 })
  } catch (error) {
    console.error('Error sending emails:', error);
    // Handle errors
    return new NextResponse('Failed to send emails', { status: 500 });
  }
}
