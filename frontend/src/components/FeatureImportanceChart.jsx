import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function FeatureImportanceChart({ data }) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value: Math.abs(value),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData.sort((a, b) => b.value - a.value)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#1976d2" />
      </BarChart>
    </ResponsiveContainer>
  );
}
