import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import ThemeProvider from '@/theme/themeProvider';
import { Container } from '@mui/material';
import { Toaster } from 'react-hot-toast';

import { UploadProvider } from '@/app/context/UploadContext';
import GlobalLoader from '@/components/GlobalLoader';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PDF Analyzer',
  description: 'AI-powered document analyzer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
        <body className={inter.className}>
          <ThemeProvider>
            <UploadProvider>
              <Header />
              <GlobalLoader />
              <Toaster position="top-center" />
              <Container maxWidth="md" sx={{ py: 6 }}>
                {children}
              </Container>
            </UploadProvider>
          </ThemeProvider>
        </body>
    </html>
  );
}
