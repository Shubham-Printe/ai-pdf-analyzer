'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box, Button } from '@mui/material';
import NextLink from 'next/link';
import { toast } from 'react-hot-toast';

import { useUpload } from '@/app/context/UploadContext';
import SummaryCard from '@/components/summaryCard';

type SummaryType = {
  _id: string;
  fileName: string;
  summary: string;
  createdAt: string;
};

export default function HistoryPage() {
  const [summaries, setSummaries] = useState<SummaryType[]>([]);
  const { setUploading, setLoadingMessage } = useUpload();


  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        setLoadingMessage('Fetching Summaries...');
        setUploading(true);
        const res = await axios.get('/api/summaries');
        setSummaries(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch summaries. Please try again.');
      } finally {
        setLoadingMessage('');
        setUploading(false); // 👈 turn off global loader
      }
    };

    fetchSummaries();
  }, [setUploading]);

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Uploaded Summaries
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Browse the summaries generated from your uploaded PDFs.
      </Typography>

      {summaries.length > 0 ? (
        summaries.map((summary) => (
          <SummaryCard
            key={summary._id}
            fileName={summary.fileName}
            summary={summary.summary}
            createdAt={summary.createdAt}
          />
        ))
      ) : (
        <Box sx={{ mt: 10, textAlign: 'center', opacity: 0.6 }}>
          <Typography variant="h6" gutterBottom>
            No summaries yet.
          </Typography>
          <Typography variant="body2" gutterBottom>
            Once you upload a PDF, your summaries will appear here.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={NextLink}
            href="/"
            sx={{ mt: 2 }}
          >
            Upload a PDF
          </Button>
        </Box>
      )}
    </Box>
  );
}
