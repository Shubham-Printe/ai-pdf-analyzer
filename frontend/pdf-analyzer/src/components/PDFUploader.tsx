'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  // CircularProgress,
  Button,
  Paper,
  LinearProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { useUpload } from '@/app/context/UploadContext';


export default function PDFUploader() {
  const { uploading, setUploading, setLoadingMessage, setUploadSuccess } = useUpload();

  const [response, setResponse] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const reset = () => {
    setUploading(false);
    setResponse(null);
    setFileName(null);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
  
    if (!file) return;
  
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }
  
    setFileName(file.name);
  
    const formData = new FormData();
    formData.append('pdf', file);
  
    try {
      setLoadingMessage('Uploading PDF...');
      setUploading(true);

      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        },
      });

      setUploadSuccess(true);
      setLoadingMessage('Uploaded Successfully!');
      await new Promise(resolve => setTimeout(resolve, 1200)); // Wait 1.2 seconds



      setResponse(res.data.summary || 'Upload complete!');
      toast.success('File uploaded and summarized!');
    } catch (error: unknown) {
      console.error(error);
      setResponse('Upload failed.');
      toast.error('Upload failed. Please try again.');
    } finally {
      setLoadingMessage('');
      setUploading(false);
      setUploadProgress(0);
      setUploadSuccess(false); // Reset for next upload


    }
  };
  

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: uploading,
  });

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 2,
        textAlign: 'center',
        backgroundColor: 'background.paper',
        position: 'relative',
      }}
    >
      {uploading && (
        <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}
      {uploading && (
        <Typography variant="caption" mt={1}>
          {uploadProgress}%
        </Typography>
      )}



      {!response ? (
        <Box {...getRootProps()} sx={{ opacity: uploading ? 0.5 : 1, cursor: uploading ? 'not-allowed' : 'pointer' }}>
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
    </Paper>
  );
}
