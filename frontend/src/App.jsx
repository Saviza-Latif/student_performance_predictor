import React, { useState } from 'react';
import StudentForm from './components/StudentForm';
import PredictionResult from './components/PredictionResult';

export default function App() {
  const [predictionResult, setPredictionResult] = useState(null);

  return (
    <div style={{ padding: 20 }}>
      <h1>Student Performance Predictor</h1>
      <StudentForm setPrediction={setPredictionResult} />
      {predictionResult && <PredictionResult result={predictionResult} />}
    </div>
  );
}
