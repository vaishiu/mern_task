import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data }) => {
  const labels = data.map(item => item.category);
  const counts = data.map(item => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;
