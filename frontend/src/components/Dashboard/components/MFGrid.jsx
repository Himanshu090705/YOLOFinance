import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard from './StatCard';
import MutualFundDashboard from '../MutualFundDashboard';

export default function MFGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Mutual Funds
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid sx={{width: "100%"}}>
          <MutualFundDashboard apiUrl={"http://localhost:4000/fetch-mf-data"}/>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
