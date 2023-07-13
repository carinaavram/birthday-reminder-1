import User from '@/models/user';
import dbConnect from '@/config/dbConnect';
import { NextResponse } from 'next/server';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateAndSanitizeInput = (input) => {
  const { name, email, password } = input;
  // Validate name field
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid name');
  }
  // Validate email field
  if (!email || typeof email !== 'string' || !validateEmail(email)) {
    throw new Error('Invalid email format');
  }
  // Validate password field
  if (!password || typeof password !== 'string' || password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  // Sanitize input fields (e.g., remove leading/trailing spaces)
  const sanitizedInput = {
    name: name.trim(),
    email: email.trim(),
    password: password.trim(),
  };
  return sanitizedInput;
};

export const POST = async (req) => {
  try {
    const input = await req.json();
    // Validate and sanitize user input
    const sanitizedInput = validateAndSanitizeInput(input);
    // Establish secure database connection
    await dbConnect();
    // Create a new secure user object
    const user = new User(sanitizedInput);
    // Save the user object to the database
    await user.save();
    return new NextResponse('User created successfully', { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('An error occurred', { status: 500 });
  }
};
