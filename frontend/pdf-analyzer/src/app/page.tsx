'use client';

import PDFUploader from '@/components/PDFUploader';
import { Typography, Box, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

export default function Home() {

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        AI-Powered PDF Analyzer
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Upload a PDF and get an AI-generated summary instantly.
      </Typography>

      <PDFUploader />

      
      <MuiLink
        component={NextLink}
        href="/history"
        underline="hover"
        variant="body2"
        sx={{ mt: 4, display: 'inline-block' }}
      >
        View uploaded summaries →
      </MuiLink>
    </Box>
  );
}
