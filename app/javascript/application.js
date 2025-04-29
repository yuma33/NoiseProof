// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import React from 'react'
import { createRoot } from 'react-dom/client';
import Test from './components/test.jsx';



document.addEventListener('turbo:load', () => {
  const container = document.getElementById('test');
  if (container) {
    const root = createRoot(container);
    const element = React.createElement(Test, { name: "World" });
    root.render(element);
  }
});