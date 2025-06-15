import React, { useState } from "react";
import StudentForm from "./components/StudentForm";
import PredictionResult from "./components/PredictionResult";
import { FormControl, InputLabel, MenuItem, Select, Box, CircularProgress, Typography } from '@mui/material';

export default function App() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('rf'); // Default to Random Forest
  const [error, setError] = useState(null); // To handle errors


  const handlePredictionError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Student Performance Predictor</h1>

      {/* Model Selection Dropdown */}
      {/* <Box sx={{ mb: 2, width: 300 }}>
        <FormControl fullWidth>
          <InputLabel>Select Model</InputLabel>
          <Select
            value={selectedModel}
            label="Select Model"
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <MenuItem value="rf">Random Forest</MenuItem>
            <MenuItem value="xgb">XGBoost</MenuItem>
           
          </Select>
        </FormControl>
      </Box> */}

      {/* Show loading spinner or form */}
      {/* {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress color="primary" />
          <Typography variant="h6" sx={{ ml: 2 }}>Processing...</Typography>
        </Box>
      ) : ( */}
        <StudentForm
          setPredictionResult={setPredictionResult}
          setInputData={setInputData}
          setIsLoading={setIsLoading}
          handleError={handlePredictionError}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel} 
        />
      {/* )} */}

      {/* Show error message if any */}
      {error && (
        <Box sx={{ mt: 2, color: 'red', textAlign: 'center' }}>
          <Typography variant="body1">{error}</Typography>
        </Box>
      )}

      {/* Show prediction result */}
      <PredictionResult
        result={predictionResult}
        inputData={inputData}
        isLoading={isLoading}
        selectedModel={selectedModel}
      />
    </div>
  );
}
