import { lazy, Suspense } from 'react';
import { usePredictions } from '../context/PredictionContext';
import { motion } from 'framer-motion';

const Chart = lazy(() => import('./Chart'));

const PredictionChart = () => {
  const { predictions } = usePredictions();

  if (predictions.length < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 bg-white p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Trend Analysis</h2>
      <div className="h-[400px]">
        <Suspense fallback={<div>Loading chart...</div>}>
          <Chart predictions={predictions} />
        </Suspense>
      </div>
    </motion.div>
  );
};

export default PredictionChart; 