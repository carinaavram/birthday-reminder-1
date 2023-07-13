import Footer from '../components/Footer';
import Header from '../components/Header';
import AuthProvider from '../components/UI/AuthProvider';
import './globals.css';
import { Ysabeau } from 'next/font/google';

const ysabeau = Ysabeau({ subsets: ['latin'], variable: '--font-ysabeau', display:'swap' });

export const metadata = {
  title: 'Birthday Reminder',
  description:
    'The Birthday Reminder app is designed to help you never forget a birthday again. With this app, you can easily manage a list of birthdays and receive convenient email notifications as reminders when a birthday is approaching.',
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
