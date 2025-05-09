import React, { useState } from 'react';
import StudentForm from './components/StudentForm';
import PredictionResult from './components/PredictionResult';

export default function App() {
  const [predictionResult, setPredictionResult] = useState(null);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Student Performance Predictor</h1>

      {/* Form to input student data */}
      <StudentForm setPrediction={setPredictionResult} />

      {/* Render PredictionResult component once the prediction is available */}
      {predictionResult && <PredictionResult result={predictionResult} />}
    </div>
  );
}
