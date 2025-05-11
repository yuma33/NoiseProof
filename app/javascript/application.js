// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import React from 'react'
import { createRoot } from 'react-dom/client';
import NoiseProof from './components/NoiseProof.jsx';
import NoisePlayer from './components/NoisePlayer.jsx';
import NoiseTypeChart from './components/NoiseTypeChart.jsx';
import NoiseTypebarChart from './components/NoiseTypebarChart.jsx';

document.addEventListener('turbo:load', () => {
  const container = document.getElementById('test');
  if (container) {
    const root = createRoot(container);
    const element = React.createElement(NoiseProof, { name: "World" });
    root.render(element);
  }
  const reportContainer = document.getElementById('report');
  if (reportContainer) {
    const recordingId = reportContainer.dataset.recordingId;
    const root = createRoot(reportContainer);
    root.render(React.createElement(NoisePlayer, { id: recordingId }));
  }

  const chartEl = document.getElementById('noise-type-chart');
  if (chartEl) {
    const raw = chartEl.dataset.distribution;
    const data = JSON.parse(raw);

    const root = createRoot(chartEl);
    root.render(
      React.createElement(NoiseTypeChart, { distribution: data })
    );
  }

  const chartE = document.getElementById('noise-report-chart');
  if (chartE) {
    // Railsから渡されたデータを取得
    const reportCounts = JSON.parse(chartE.dataset.counts);
    const maxDbs = JSON.parse(chartE.dataset.dbs);


    // Reactでコンポーネントをレンダリング
    const root = createRoot(chartE);
    root.render(
      React.createElement(NoiseTypebarChart, {reportCounts: reportCounts,
        maxDbs: maxDbs})
    );
  }
});