import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Paper, 
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const API_ENDPOINT = 'https://9ofzl6ml5c.execute-api.us-east-1.amazonaws.com/dev/predict';

const PredictionForm = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      // Sample data - you'll need to adjust this based on your model's requirements
      const data = {
        "data": [
          [0.1, 0.2, 0.3, 0.4, 0.5],
          [0.2, 0.3, 0.4, 0.5, 0.6],
          [0.3, 0.4, 0.5, 0.6, 0.7]
        ]
      };

      const response = await axios.post(API_ENDPOINT, data);
      setResult(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Railway Predictive Maintenance
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Make Prediction'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Prediction Results:</Typography>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PredictionForm; 