import React, { useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";
import {Chart as ChartJS,RadialLinearScale,PointElement,LineElement,Filler,Tooltip,Legend} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = ({ studentData }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);  // Track error state
  console.log("Received studentData:", studentData);
  useEffect(() => {
    const fetchData = async () => {
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

        const radarData = {
          labels: Object.keys(data.student_values || {}),
          datasets: [
            {
              label: "Student Profile",
              data: Object.values(data.student_values || {}),
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
            {
              label: "Top Performer",
              data: Object.values(data.top_values || {}),
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "Average",
              data: Object.values(data.average_values || {}),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        };

        setChartData(radarData);
      } catch (error) {
        console.error("Error fetching radar chart data:", error);
        setError(error.message || 'An error occurred while fetching data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [studentData]);

  if (isLoading) {
    return <p>Loading chart...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h3>Radar Chart Comparison</h3>
      {chartData && chartData.datasets ? (
        <Radar data={chartData} />
      ) : (
        <p>No data available for the chart</p>
      )}
    </div>
  );
};

export default RadarChart;
