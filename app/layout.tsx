import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { WaitlistProvider } from '@/utils/WaitlistContext';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SkillPod - Learn anything. Teach anything. Get paid.',
  description: 'SkillPod is a fun, flexible, and rewarding learning platform where anyone can learn real-world skills, teach what they know, and earn money.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <WaitlistProvider>
          {children}
        </WaitlistProvider>
      </body>
    </html>
  );
} 