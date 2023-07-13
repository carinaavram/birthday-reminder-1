import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import dbConnect from '@/config/dbConnect';
import NextAuth from 'next-auth/next';

// Function to validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate and sanitize user input
const validateAndSanitizeInput = (input) => {
  const { email, password } = input;
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
    email: email.trim(),
    password: password.trim(),
  };
  return sanitizedInput;
};

const handler = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 1800,
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      async authorize(credentials, req) {
        try {
          dbConnect();
          // Validate and sanitize user input
          const sanitizedCredentials = validateAndSanitizeInput(credentials);
          const { email, password } = sanitizedCredentials;
          const user = await User.findOne({ email });
          if (user) {
            const isPasswordMatched = await bcrypt.compare(
              password,
              user.password
            );
            if (isPasswordMatched) {
              return {
                name: user.name,
                email: user.email,
              };
            } else {
              throw new Error('Invalid Email or Password');
            }
          } else {
            throw new Error('Invalid Email or Password');
          }
        } catch (error) {
          throw new Error('An error occurred');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }
      return Promise.resolve(token);
    },
    async session({ session, token, user }) {
      session.user = {
        name: token.name,
        email: token.email,
      };
      return Promise.resolve(session);
    },
  },
  pages: {
    error: '/login',
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
export { handler as GET, handler as POST };
