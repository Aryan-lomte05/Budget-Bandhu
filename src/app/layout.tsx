import type { Metadata } from 'next';
import { Poppins, Roboto_Mono } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { ParallaxBackground } from '@/components/shared/ParallaxBackground';
import { FloatingElements } from '@/components/shared/FloatingElements';
import { Toaster } from 'react-hot-toast';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const robotoMono = Roboto_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Budget Bandhu - Your Financial Friend',
  description: 'AI-powered personal finance management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${robotoMono.variable}`}>
      <body className="font-sans antialiased">
        <SmoothScrollProvider>
          {/* <ParallaxBackground /> */}
          <FloatingElements />
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#10B981',
                color: '#fff',
              },
            }}
          />
          <ShadcnToaster />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
