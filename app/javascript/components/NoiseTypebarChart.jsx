import React from 'react';
import {
  Chart as ChartJS, Title, Tooltip, Legend,
  LineElement, CategoryScale, LinearScale,
  BarElement, PointElement, LineController
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, LineController,
  Title, Tooltip, Legend
);

const NoiseTypebarChart = ({ reportCounts, maxDbs }) => {
  const hours = [];
  const countsData = [];
  const maxDbData = [];

  for (let i = 0; i < 24; i++) {
    hours.push(`${i}:00`);
    countsData.push(reportCounts[i] || 0);
    maxDbData.push(maxDbs[i] ? Math.ceil((maxDbs[i]) * 10) / 10 : 0);
  }

  const data = {
    labels: hours,
    datasets: [
      {
        label: '最大dB',
        data: maxDbData,
        type: 'line',
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.1,
        yAxisID: 'y',
      },
      {
        label: '騒音回数',
        data: countsData,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(128, 0, 128, 0.2)',
        borderWidth: 1,
        yAxisID: 'y1',
      }
    ]
  };

  const options = {
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      title: {
        display: true,
        text: '騒音の発生時間帯別分析'
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: '最大dB'
        },
        grid: {
          drawOnChartArea: true
        },
        beginAtZero: true
      },
      y1: {
        type: 'linear',
        display: false,
        position: 'right',
        title: {
          display: false,
          text: '騒音回数'
        },
        grid: {
          drawOnChartArea: false
        },
        beginAtZero: true
      }
    }
  };

  return (
    
    <div className="w-4/5 mt-10 md:mt-16 flex justify-center items-center mx-auto">
      <Bar data={data} options={options} />
    </div>
  );
};

export default NoiseTypebarChart;
