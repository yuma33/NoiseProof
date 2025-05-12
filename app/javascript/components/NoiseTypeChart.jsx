import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const NoiseTypeChart = ({ distribution }) => {
  const labels = Object.keys(distribution);
  const values = Object.values(distribution);
  const colorMap = {
    "その他": "#e5e7eb",
    "足音（足音、飛び跳ねなど）": "#fef3c7",
    "生活機械音（家電製品など）": "#bfdbfe",
    "人の声": "#f3e8ff",
    "音楽、映像音（テレビなど）": "#fce7f3",
    "衝撃音（ドアや窓の閉会など)": "#fecaca",
    "ペット（鳴き声、動物の移動音など）": "#d1fae5",
    "外部環境音（車の音、工事音など)": "#ffedd5"
  };

  const backgroundColor = labels.map(label => colorMap[label]);

  // パーセンテージ計算
  const total = values.reduce((sum, value) => sum + value, 0);
  const percentages = values.map(value => ((value / total) * 100).toFixed(1));

  const data = {
    labels,
    datasets: [
      {
        label: '騒音の種類',
        data: values,
        backgroundColor: backgroundColor
      }
    ]
  };

  // グラフのオプション設定
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: '騒音の種類別分布'
      },
      legend: {
        position: 'left',
        labels: {
          boxWidth: 10,
        }
      },
      datalabels: {
        formatter: (value, context) => {
          const percentage = percentages[context.dataIndex];
          return `${percentage}%`;
        },
        color: '#000',
        font: {
          weight: 'bold',
        },

      },
    }
  };

  return (
    <div className="text-xs text-neutral-500 font-bold text-center mt-16">
      騒音の種類別分布
      <Pie data={data} options={options} />
    </div>
  );
};

export default NoiseTypeChart;

