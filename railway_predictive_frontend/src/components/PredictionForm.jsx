import { useState } from 'react';
import { getPrediction } from '../services/api';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorAlert from './common/ErrorAlert';
import toast from 'react-hot-toast';

const PredictionForm = ({ onPredictionResult }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    temperature: '',
    vibration: '',
    pressure: '',
    rpm: ''
  });

  const validateInput = (data) => {
    if (data.temperature < -50 || data.temperature > 150) {
      throw new Error('Temperature must be between -50°C and 150°C');
    }
    if (data.vibration < 0 || data.vibration > 50) {
      throw new Error('Vibration must be between 0 and 50 mm/s');
    }
    if (data.pressure < 0 || data.pressure > 500) {
      throw new Error('Pressure must be between 0 and 500 bar');
    }
    if (data.rpm < 0 || data.rpm > 10000) {
      throw new Error('RPM must be between 0 and 10000');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      validateInput(formData);
      const result = await getPrediction(formData);
      onPredictionResult(result, formData);
      toast.success('Prediction generated successfully!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value) || ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Temperature (°C)</label>
          <div className="relative">
            <input
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
              required
              step="0.1"
              placeholder="Enter temperature"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">°C</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Vibration (mm/s)</label>
          <div className="relative">
            <input
              type="number"
              name="vibration"
              value={formData.vibration}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
              required
              step="0.01"
              placeholder="Enter vibration"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">mm/s</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Pressure (bar)</label>
          <div className="relative">
            <input
              type="number"
              name="pressure"
              value={formData.pressure}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
              required
              step="0.1"
              placeholder="Enter pressure"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">bar</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">RPM</label>
          <div className="relative">
            <input
              type="number"
              name="rpm"
              value={formData.rpm}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
              required
              step="1"
              placeholder="Enter RPM"
            />
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} />}
      
      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
        >
          {loading ? <LoadingSpinner /> : 'Generate Prediction'}
        </button>
      </div>
    </form>
  );
};

export default PredictionForm; 