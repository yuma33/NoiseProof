// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import React from 'react'
import { createRoot } from 'react-dom/client';
import NoiseProof from './components/NoiseProof.jsx';


document.addEventListener('turbo:load', () => {

  const fallback = document.getElementById('rails-fallback-ui');
  if (fallback) fallback.remove();

  const container = document.getElementById('test');
  if (container) {
    const root = createRoot(container);
    const element = React.createElement(NoiseProof, { name: "World" });
    root.render(element);
  }
});