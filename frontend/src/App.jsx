import React, { useState } from 'react';
import StudentForm from './components/StudentForm';
import PredictionResult from './components/PredictionResult';

export default function App() {
  const [prediction, setPrediction] = useState(null);

  return (
    <div style={{ padding: 20 }}>
      <h1>Student Performance Predictor</h1>
      <StudentForm setPrediction={setPrediction} />
      {prediction !== null && <PredictionResult score={prediction} />}
    </div>
  );
}
