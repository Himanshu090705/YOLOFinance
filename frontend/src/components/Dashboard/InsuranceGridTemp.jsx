import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InsuranceDashboardPurchased from './InsuranceDashboardPurchased';

export default function InsuranceGridTemp() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Grid container spacing={2} columns={12}>
        <Grid sx={{width: "100%"}}>
          <InsuranceDashboardPurchased />
        </Grid>
      </Grid>
    </Box>
  );
}
