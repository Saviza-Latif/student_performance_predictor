import React, { useEffect, useState } from "react";
import RadarChart from './RadarChart';
import BarComparisonChart from './BarComparisonChart';
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Box,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

export default function PredictionResult({ result, isLoading, inputData, selectedModel = "rf" }) {
  const [metrics, setMetrics] = useState(null);
  const [metricsError, setMetricsError] = useState(false);

  // Fetch model metrics for the selected model
  useEffect(() => {
    if (selectedModel) {
      fetch(`http://localhost:8000/metrics?model=${selectedModel}`)
        .then(res => res.json())
        .then(data => {
          setMetrics(data);
          setMetricsError(false);
        })
        .catch(err => {
          console.error("Error fetching metrics:", err);
          setMetricsError(true);
        });
    }
  }, [selectedModel]);

  if (isLoading) {
    return (
      <Card sx={{ mt: 4, textAlign: 'center' }}>
        <CardContent>
          <CircularProgress color="primary" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading Prediction Results...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!result) return <div>No result available</div>;

  
  const { predicted_score, suggestions = [], contributions={} } = result;

  // Convert contributions to an array of objects for the chart
  const data = Object.entries(contributions).map(([feature, importance]) => ({
    feature,
    importance: Math.abs(importance), 
  }));
  console.log("data of importance",data);
  // Debugging: Log the result data to see if it's being passed correctly
  console.log("Prediction Result:", result);
  console.log("Metrics:", metrics);

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" color="primary" gutterBottom>
          Predicted Exam Score: <strong>{predicted_score}</strong>
        </Typography>

        {/* Display model performance metrics */}
        {metricsError ? (
          <Typography variant="body2" color="textSecondary">
            Could not fetch model metrics. Please try again later.
          </Typography>
        ) : metrics ? (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Model Performance:
            </Typography>
            <List>
              <ListItem>MAE: {metrics.mae ? metrics.mae.toFixed(2) : 'N/A'}</ListItem>
              <ListItem>MSE: {metrics.mse ? metrics.mse.toFixed(2) : 'N/A'}</ListItem>
              <ListItem>RMSE: {metrics.rmse ? metrics.rmse.toFixed(2) : 'N/A'}</ListItem>
              <ListItem>R²: {metrics.r2 ? metrics.r2.toFixed(2) : 'N/A'}</ListItem>
            </List>
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">Model metrics not available.</Typography>
        )}

        {/* Display top influencing features */}
        {data.length > 0 ? (
          <>
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
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">No contributing features found.</Typography>
        )}

        {/* Display suggestions */}
        {suggestions.length > 0 ? (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Personalized Suggestions:
            </Typography>
            <List>
              {suggestions.map((tip, index) => (
                <ListItem key={index}>• {tip}</ListItem>
              ))}
            </List>
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">No personalized suggestions available.</Typography>
        )}
      </CardContent>

      {/* Display additional charts if input data is available */}
      {inputData && (
        <>
          <RadarChart studentData={inputData} />
          <BarComparisonChart studentData={inputData} />
        </>
      )}
    </Card>
  );
}
