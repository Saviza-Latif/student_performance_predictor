import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarComparisonChart = ({ studentData }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8000/radar-chart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentData),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }

        const data = await response.json();

        const labels = Object.keys(data.student_values);

        setChartData({
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
        });
      } catch (err) {
        setError(err.message || "An error occurred while fetching chart data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (studentData) {
      fetchChartData();
    }
  }, [studentData]);

  if (isLoading) return <p>Loading chart...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem" }}>
      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Student vs Top & Average Performers
      </h3>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: {
                display: true,
                text: "Comparison of Key Performance Factors",
                font: { size: 16 }
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { precision: 0 }
              }
            }
          }}
        />
      ) : (
        <p>No data to display.</p>
      )}
    </div>
  );
};

export default BarComparisonChart;
