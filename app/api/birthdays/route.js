import dbConnect from '@/config/dbConnect';
import Birthday from '@/models/birthday';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function handler(req, res) {
  const session = await getServerSession({req});
  if (!session) {
    return new NextResponse('Unauthorized User', {status: 401})
  } else {
    if (req.method === 'POST') {
    
      try {
        const body = await req.json();
        //Conect to db
        dbConnect();
  
        //Validate form data
        if (!body.name || !body.date) {
          return new NextResponse('Please fill in all required fields', {
            status: 400,
          });
        }
  
        // Validate the name field
        if (body.name.length < 2 || body.name.length > 50) {
          return new NextResponse(
            'Name should be between 2 and 50 characters long',
            { status: 400 }
          );
        }
        const birthday = new Birthday(body);
        //Succesfull response
        await birthday.save();
        return NextResponse.json(birthday, { status: 201 });
      } catch (error) {
        return new NextResponse('Failed to create birthday', { status: 500 });
      }
    }
    if (req.method === 'GET') {
      try {
        let params = req.nextUrl.searchParams;
        let userEmail = params.get('userEmail');
  
        if (!userEmail) {
          return new NextResponse('User email is missing', { status: 400 });
        }
  
        dbConnect();
        const birthdays = await Birthday.find({ email: userEmail });
        return new NextResponse(JSON.stringify(birthdays), { status: 200 });
      } catch (error) {
        return new NextResponse('Failed to fetch birthdays', { status: 500 });
      }
    }
  }
}
export { handler as POST, handler as GET };
