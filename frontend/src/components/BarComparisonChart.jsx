import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarComparisonChart = ({ studentData }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);  // Track error state

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch("http://localhost:8000/radar-chart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentData),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const labels = Object.keys(data.student_values);

        const chartData = {
          labels,
          datasets: [
            {
              label: "Student",
              data: Object.values(data.student_values),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            {
              label: "Top Performer",
              data: Object.values(data.top_values),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            {
              label: "Average",
              data: Object.values(data.average_values),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        };

        setChartData(chartData);
      } catch (err) {
        console.error("Error loading bar chart data:", err);
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [studentData]);

  if (isLoading) {
    return <p>Loading chart...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h3>Student vs Top & Average Performers</h3>
      {chartData ? (
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      ) : (
        <p>No data available for the chart</p>
      )}
    </div>
  );
};

export default BarComparisonChart;
