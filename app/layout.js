'use client';

import Footer from './components/Footer';
import Header from './components/Header';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Birthday Reminder',
  description:
    'Everyone struggles to remember birthdays, but this app will help you by sending notifications straight to your email when a birthday is coming up',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Header />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
