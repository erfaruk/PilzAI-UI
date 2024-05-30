
import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

function Copyright() {
  return (
    <Box sx={{ bgcolor: '#242424', mt: 2 }} component="footer">
      <Typography sx={{color:'white'}} variant="body2" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://pilz.biz.tr/">
          Pilz Türkiye
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Box>
  );
}

export default Copyright;
