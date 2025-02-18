import { useState } from 'react';
import PredictionForm from '../components/PredictionForm';
import PredictionResults from '../components/PredictionResults';
import PredictionHistory from '../components/PredictionHistory';
import PredictionChart from '../components/PredictionChart';
import { usePredictions } from '../context/PredictionContext';
import { motion } from 'framer-motion';

const Prediction = () => {
  const [predictionResult, setPredictionResult] = useState(null);
  const { addPrediction } = usePredictions();
  const [formData, setFormData] = useState(null);

  const handlePredictionResult = (result, data) => {
    setPredictionResult(result);
    setFormData(data);
    addPrediction({ ...result, ...data });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Railway Equipment Prediction
      </h1>
      <PredictionForm onPredictionResult={handlePredictionResult} />
      <PredictionResults result={predictionResult} />
      <PredictionChart />
      <PredictionHistory />
    </motion.div>
  );
};

export default Prediction; 