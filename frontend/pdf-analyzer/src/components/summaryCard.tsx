'use client';

import { useState } from 'react';
import { Card, CardContent, Typography, Divider, Button } from '@mui/material';

type Props = {
  fileName: string;
  summary: string;
  createdAt: string;
};

export default function SummaryCard({ fileName, summary, createdAt }: Props) {
  
  const [expanded, setExpanded] = useState(false);
  const isLong = summary.length > 300;
  const displayText = expanded || !isLong
    ? summary
    : `${summary.slice(0, 300)}...`;

  const prettifyFileName = (name: string) =>
      name
        .replace(/\.[^/.]+$/, '') // remove extension
        .replace(/[-_]/g, ' ') // replace dashes/underscores with spaces
        .replace(/\s+/g, ' ') // collapse multiple spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize each word

  return (
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2, overflowWrap: 'break-word' }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" noWrap overflow="hidden" textOverflow="ellipsis">
        {prettifyFileName(fileName)}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }} noWrap overflow="hidden" textOverflow="ellipsis">
          {displayText}
        </Typography>

        {isLong && (
          <Button size="small" onClick={() => setExpanded(!expanded)} sx={{ mt: 1 }}>
            {expanded ? 'Show Less' : 'Show More'}
          </Button>
        )}

        <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }} noWrap overflow="hidden" textOverflow="ellipsis">
          
          Uploaded: {new Date(createdAt).toUTCString()}

        </Typography>
      </CardContent>
    </Card>
  );
}
