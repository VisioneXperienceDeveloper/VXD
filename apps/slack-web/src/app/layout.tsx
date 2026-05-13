import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import { Providers } from '@/shared/components/Providers';
import './globals.css';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VXD's slack-web",
  description: 'A minimal Slack clone with Linear-inspired monochrome design',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

