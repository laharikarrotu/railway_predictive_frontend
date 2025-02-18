import { createContext, useContext, useState, useEffect } from 'react';

const PredictionContext = createContext();

export function PredictionProvider({ children }) {
  const [predictions, setPredictions] = useState(() => {
    const saved = localStorage.getItem('predictions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('predictions', JSON.stringify(predictions));
  }, [predictions]);

  const addPrediction = (prediction) => {
    const newPrediction = {
      ...prediction,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    setPredictions(prev => [newPrediction, ...prev]);
  };

  return (
    <PredictionContext.Provider value={{ predictions, addPrediction }}>
      {children}
    </PredictionContext.Provider>
  );
}

export const usePredictions = () => useContext(PredictionContext); 