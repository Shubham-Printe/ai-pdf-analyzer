import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import ThemeProvider from '@/theme/themeProvider';
import { Container } from '@mui/material';

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
          <Header />
          <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 4 } }}>
            {children}
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
