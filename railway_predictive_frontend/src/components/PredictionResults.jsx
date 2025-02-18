const PredictionResults = ({ result }) => {
  if (!result) return null;

  const getRiskLevel = (probability) => {
    if (probability > 0.7) return 'High Risk';
    if (probability > 0.3) return 'Medium Risk';
    return 'Low Risk';
  };

  const getRiskColor = (probability) => {
    if (probability > 0.7) return 'text-red-600';
    if (probability > 0.3) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRecommendation = (probability) => {
    if (probability > 0.7) return 'Immediate maintenance required';
    if (probability > 0.3) return 'Schedule maintenance soon';
    return 'Normal operation - no action needed';
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Prediction Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Status</h3>
          <p className={`mt-1 text-lg font-semibold ${getRiskColor(result.probability)}`}>
            {getRiskLevel(result.probability)}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Failure Probability</h3>
          <p className="mt-1 text-lg font-semibold">
            {(result.probability * 100).toFixed(1)}%
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Confidence Score</h3>
          <p className="mt-1 text-lg font-semibold">
            {(result.confidence * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-500">Recommended Action</h3>
        <p className="mt-1 text-lg">
          {getRecommendation(result.probability)}
        </p>
      </div>
    </div>
  );
};

export default PredictionResults; 