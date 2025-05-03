import React from 'react';
import { Typography } from '@mui/material';

export default function PredictionResult({ score }) {
  return (
    <Typography variant="h5" color="primary">
      Predicted Exam Score: {score}
    </Typography>
  );
}
