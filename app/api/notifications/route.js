import dbConnect from '@/config/dbConnect';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

const handler = async (req, res) => {
  const session = await getServerSession({ req });
  if (!session) {
    return new NextResponse('Unauthorized User', { status: 401 });
  } else {
    if (req.method === 'PUT') {
      const { userEmail, notificationDays, receiveEmailNotification } =
        await req.json();
      try {
        dbConnect();
        const user = await User.findOneAndUpdate({ email: userEmail }, {
          $set: {
            notificationDays: notificationDays,
            receiveEmailNotification: receiveEmailNotification
          }
        },
        { new: true });

        return new NextResponse('Notifications days updated succesfully', {
          status: 200,
        });
      } catch (error) {
        return new NextResponse('Failed to update notifications days', {
          status: 500,
        });
      }
    }
    if (req.method === 'GET') {
      let params = req.nextUrl.searchParams;
      let userEmail = params.get('userEmail');
      try {
        if (!userEmail) {
          return new NextResponse('User email is missing', { status: 400 });
        }

        dbConnect();
        const { receiveEmailNotification, notificationDays } =
          await User.findOne({ email: userEmail });
        return new NextResponse(
          JSON.stringify({ receiveEmailNotification, notificationDays }),
          { status: 200 }
        );
      } catch (error) {
        return new NextResponse('Database Error', { status: 500 });
      }
    }
  }
};

export { handler as PUT, handler as GET };
