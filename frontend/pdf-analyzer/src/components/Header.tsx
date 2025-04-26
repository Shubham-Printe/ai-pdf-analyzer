'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Stack,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useThemeToggle } from '@/theme/themeProvider';
import { useEffect, useState } from 'react';

const Header = () => {
  const pathname = usePathname();
  const theme = useTheme();
  const { toggleTheme } = useThemeToggle();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ mb: 4 }}
    >
      <Toolbar
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: { xs: 'center', sm: 'left' },
          gap: { xs: 2, sm: 0 }, // More space between title and buttons in mobile view
          width: '100%',
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ mb: { xs: 2, sm: 0 } }}>
          PDF Analyzer
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems="center"
        >
          <Button
            component={NextLink}
            href="/"
            variant={pathname === '/' ? 'contained' : 'text'}
          >
            Upload
          </Button>
          <Button
            component={NextLink}
            href="/history"
            variant={pathname === '/history' ? 'contained' : 'text'}
          >
            History
          </Button>
          <IconButton onClick={toggleTheme} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
