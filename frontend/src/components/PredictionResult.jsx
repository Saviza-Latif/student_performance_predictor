import React from "react";
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

export default function PredictionResult({ result, isLoading, inputData }) {
  console.log("Received studentData:",inputData);
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

  if (!result) return null;

  const { predicted_score, contributions = {}, suggestions = [] } = result;

  const data = Object.entries(contributions).map(([feature, importance]) => ({
    feature,
    importance: Math.abs(importance),
  }));

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" color="primary" gutterBottom>
          Predicted Exam Score: <strong>{predicted_score}</strong>
        </Typography>

        {data.length > 0 && (
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
        )}

        {suggestions.length > 0 && (
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
        )}
      </CardContent>

      {inputData && (
        <>
          <RadarChart studentData={inputData} />
          <BarComparisonChart studentData={inputData} />
        </>
      )}
    </Card>
  );
}
