import Footer from '../components/Footer';
import Header from '../components/Header';
import AuthProvider from '../components/UI/AuthProvider';
import './globals.css';
import { Ysabeau } from 'next/font/google';

const ysabeau = Ysabeau({ subsets: ['latin'], variable: '--font-ysabeau', display:'swap' });

export const metadata = {
  title: 'Birthday Reminder',
  description:
    'Everyone struggles to remember birthdays, but this app will help you by sending notifications straight to your email when a birthday is coming up',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={ysabeau.className}>
      <body>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
