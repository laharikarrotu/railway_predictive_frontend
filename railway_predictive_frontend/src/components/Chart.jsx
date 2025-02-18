import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Chart = ({ predictions }) => {
  const data = [...predictions]
    .reverse()
    .map(p => ({
      timestamp: new Date(p.timestamp).toLocaleTimeString(),
      probability: (p.probability * 100).toFixed(1),
      temperature: p.temperature,
      vibration: p.vibration,
      pressure: p.pressure,
      rpm: p.rpm
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="probability" 
          stroke="#EF4444" 
          name="Failure Risk (%)" 
        />
        <Line 
          type="monotone" 
          dataKey="temperature" 
          stroke="#3B82F6" 
          name="Temperature (°C)" 
        />
        <Line 
          type="monotone" 
          dataKey="vibration" 
          stroke="#10B981" 
          name="Vibration (mm/s)" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart; 