// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import React from 'react'
import { createRoot } from 'react-dom/client';
import NoiseProof from './components/NoiseProof.jsx';
import NoisePlayer from './components/NoisePlayer.jsx';

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
});