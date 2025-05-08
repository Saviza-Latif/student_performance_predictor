import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function PredictionResult({ result }) {
  if (!result) return null;

  const { predicted_score, contributions } = result;

  // Transform SHAP dict to array for bar chart
  const data = Object.entries(contributions).map(([feature, importance]) => ({
    feature,
    importance: Math.abs(importance), // Absolute value for charting
  }));

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" color="primary" gutterBottom>
          Predicted Exam Score: {predicted_score}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Top Influencing Features:
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.slice(0, 10)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="feature" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="importance" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
