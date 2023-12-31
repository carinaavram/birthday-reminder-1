import dbConnect from '@/config/dbConnect';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

async function handler(req, res) {
  const session = await getServerSession({ req });
  if (!session) {
    return new NextResponse('Unauthorized User', { status: 401 });
  } else {
    if (req.method === 'GET') {
      let params = req.nextUrl.searchParams;
      let userEmail = params.get('userEmail');
      try {
        if (!userEmail) {
          return new NextResponse('User email is missing', { status: 400 });
        }

        dbConnect();
        const user = await User.findOne({ email: userEmail });
        return new NextResponse(JSON.stringify(user), { status: 200 });
      } catch (error) {
        return new NextResponse('Database Error', { status: 500 });
      }
    }
    if (req.method === 'PUT') {
      const { userEmail, updatedFields } = await req.json();

      try {
        dbConnect();
        const updateData = {};
        if (updatedFields.name) {
          updateData.name = updatedFields.name;
        }
        if (updatedFields.email) {
          updateData.email = updatedFields.email;
        }
        if (updatedFields.password) {
          updateData.password = updatedFields.password;
        }
        await User.findOneAndUpdate(
          { email: userEmail },
          { $set: updateData },
          { new: true }
        );
        return new NextResponse('User updated successfully', { status: 200 });
      } catch (error) {
        return new NextResponse('Database Error', { status: 500 });
      }
    }
  }
}

export { handler as GET, handler as PUT };
