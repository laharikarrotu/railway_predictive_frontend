import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getPrediction = async (data) => {
  try {
    const response = await api.post('/predict', {
      inputs: data
    });

    console.log('Raw API Response:', response.data);
    
    // Response is already in the correct format
    const prediction = {
      probability: response.data.probability,    // Already in percentage
      prediction: response.data.prediction,
      confidence: response.data.confidence,      // Already in percentage
      status: response.data.status,
      action: response.data.action,
      rawInputs: response.data.raw_inputs
    };

    console.log('Final prediction:', prediction);
    return prediction;
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error('Failed to get prediction');
  }
}; 