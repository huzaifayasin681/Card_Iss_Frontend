import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'CardDash - Card Issuance Platform',
  description: 'Modern card issuance platform with simplified card management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}