import React, { useState } from 'react';
import StudentForm from './components/StudentForm';
import PredictionResult from './components/PredictionResult';

export default function App() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
        Student Performance Predictor
      </h1>

      <StudentForm
        setPredictionResult={setPredictionResult}
        setInputData={setInputData}
        setIsLoading={setIsLoading}
      />

      <PredictionResult
        result={predictionResult}
        inputData={inputData}
        isLoading={isLoading}
      />
    </div>
  );
}
