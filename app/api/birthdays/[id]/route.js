import dbConnect from '@/config/dbConnect';
import Birthday from '@/models/birthday';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

const handler = async (req, { params, body }, res) => {
  const session = await getServerSession({req});
  if (!session) {
    return new NextResponse('Unauthorized User', {status: 401})
  } else {
    if (req.method === 'GET') {
      const id = params.id;
      try {
        dbConnect();
        const birthday = await Birthday.findById(id);
        return new NextResponse(JSON.stringify(birthday), { status: 200 });
      } catch (error) {
        return new NextResponse('Database Error', { status: 500 });
      }
    }
    if (req.method === 'PUT') {
      const id = params.id;
      const updatedData = await req.json();
  
      try {
        dbConnect();
  
        const updatedBirthday = await Birthday.findByIdAndUpdate(
          id,
          updatedData,
          { new: true }
        );
  
        console.log(updatedBirthday);
        if (!updatedData) {
          return new NextResponse('Birthday not found', { status: 404 });
        }
  
        return new NextResponse('Birthday updated succesfully!', { status: 200 });
      } catch (error) {
        return new NextResponse('Database Error', { status: 500 });
      }
    }
    if (req.method === 'DELETE') {
      const id = params.id;
      try {
        dbConnect();
  
        await Birthday.findByIdAndDelete(id);
  
        return new NextResponse('Birthday has been deleted!', { status: 200 });
      } catch (error) {
        return new NextResponse('Database Error', { status: 500 });
      }
    }
  }
};

export { handler as GET, handler as PUT, handler as DELETE};
