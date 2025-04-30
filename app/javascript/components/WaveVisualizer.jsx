import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function WaveVisualizer({ dbHistory }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const barWidth = width / dbHistory.length;
    const gap = 2;

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // Set soft background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#f3e8ff');
    bgGradient.addColorStop(1, '#faf5ff');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw Bars
    dbHistory.forEach((db, i) => {
      const x = i * barWidth;
      const barHeight = (db / 100) * height * 0.7;
      const y = height - barHeight;

      // Smooth gradient bar
      const barGradient = ctx.createLinearGradient(x, y, x, height);
      barGradient.addColorStop(1, '#c084fc');
      barGradient.addColorStop(0, '#a855f7');

      ctx.fillStyle = barGradient;
      ctx.fillRect(x + gap, y, barWidth - gap * 2, barHeight);
    });
  }, [dbHistory]);

  return (
    <div className="w-full h-32 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-100 to-purple-200 relative mb-3">
      <canvas
        ref={canvasRef}
        width={600}
        height={128}
        className="w-full h-full"
      />
    </div>
  );
}

WaveVisualizer.propTypes = {
  dbHistory: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default WaveVisualizer;
