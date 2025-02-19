import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BarChart } from "@mui/x-charts/BarChart";

// Styled Components
const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const WeeklyStatCard = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Dummy data for testing
    const dummyData = {
      weeks: ["Week 1", "Week 2", "Week 3", "Week 4"],
      caloriesBurned: [500, 600, 550, 700],
    };

    // Log the dummy data
    console.log("Dummy Chart Data: ", dummyData);

    // Set the dummy data to the chartData state
    setChartData(dummyData);
  }, []); // Only run once when the component mounts

  // Return loading state while chartData is null
  if (!chartData) {
    return (
      <Card>
        <Title>Weekly Calories Burned</Title>
        <div>Loading...</div>
      </Card>
    );
  }

  return (
    <Card>
      <Title>Weekly Calories Burned</Title>
      {/* Render BarChart with dummy data */}
      <BarChart
        xAxis={[{ scaleType: "band", data: chartData.weeks }]}
        series={[{ data: chartData.caloriesBurned }]}
        height={300}
      />
    </Card>
  );
};

export default WeeklyStatCard;
