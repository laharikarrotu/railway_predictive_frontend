import { usePredictions } from '../context/PredictionContext';
import { motion } from 'framer-motion';

const PredictionHistory = () => {
  const { predictions } = usePredictions();

  if (predictions.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Prediction History</h2>
      <div className="space-y-4">
        {predictions.map((prediction, index) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">
                  {new Date(prediction.timestamp).toLocaleString()}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Temperature:</span>
                    <span className="ml-2 font-medium">{prediction.temperature}°C</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Vibration:</span>
                    <span className="ml-2 font-medium">{prediction.vibration} mm/s</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pressure:</span>
                    <span className="ml-2 font-medium">{prediction.pressure} bar</span>
                  </div>
                  <div>
                    <span className="text-gray-600">RPM:</span>
                    <span className="ml-2 font-medium">{prediction.rpm}</span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                prediction.probability > 0.7 
                  ? 'bg-red-100 text-red-800'
                  : prediction.probability > 0.3
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {(prediction.probability * 100).toFixed(1)}% Risk
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PredictionHistory; 