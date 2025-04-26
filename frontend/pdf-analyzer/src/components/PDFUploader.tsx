'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

export default function PDFUploader() {
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const reset = () => {
    setUploading(false);
    setResponse(null);
    setFileName(null);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFileName(file.name);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      setUploading(true);
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResponse(res.data.summary || 'Upload complete!');
    } catch (error) {
      console.error(error);
      setResponse('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 2,
        textAlign: 'center',
        backgroundColor: 'background.paper',
      }}
    >

      {!response ? (
        <Box {...getRootProps()} sx={{ cursor: 'pointer' }}>
          <input {...getInputProps()} />
          <CloudUploadIcon fontSize="large" />
          <Typography variant="h6" mt={2}>
            Drag & drop a PDF here, or click to upload
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            ✅ Uploaded: {fileName}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {response}
          </Typography>
          <Button variant="outlined" onClick={reset} sx={{ mt: 3 }}>
            Upload Another
          </Button>
        </Box>
      )}

      {uploading && (
        <CircularProgress size={24} sx={{ mt: 3 }} />
      )}
    </Paper>
  );
}
