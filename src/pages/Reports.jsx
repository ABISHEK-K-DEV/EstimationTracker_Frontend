import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  BarChart as ReportsIcon
} from '@mui/icons-material';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ReportsIcon color="primary" sx={{ fontSize: 40 }} />
          Reports
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Reports Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detailed project and team reports will be available here.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
