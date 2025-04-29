import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function WaveVisualizer({ dbHistory }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const maxHeight = canvas.height;
    const width = canvas.width;
    const barWidth = width / dbHistory.length;
    const gap = 1;

    ctx.clearRect(0, 0, width, maxHeight);

    ctx.strokeStyle = 'rgba(124, 58, 237, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < maxHeight; i += 10) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    for (let i = 0; i < width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, maxHeight);
      ctx.stroke();
    }

    dbHistory.forEach((db, i) => {
      const x = i * barWidth;
      const barHeight = (db / 100) * maxHeight * 0.8;
      const y = maxHeight - barHeight - 10;

      const mainGradient = ctx.createLinearGradient(x, y, x, maxHeight);
      mainGradient.addColorStop(0, 'rgba(124, 58, 237, 0.9)');
      mainGradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.6)');
      mainGradient.addColorStop(1, 'rgba(124, 58, 237, 0.2)');

      ctx.beginPath();
      ctx.moveTo(x + gap, maxHeight);
      ctx.lineTo(x + gap, y + 2);
      ctx.arc(x + gap + (barWidth - gap * 2) / 2, y + 2, (barWidth - gap * 2) / 2, Math.PI, 0, false);
      ctx.lineTo(x + barWidth - gap, maxHeight);
      ctx.fillStyle = mainGradient;
      ctx.fill();

      const highlightGradient = ctx.createLinearGradient(x, y, x + barWidth, y);
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

      ctx.beginPath();
      ctx.moveTo(x + gap, y + 15);
      ctx.lineTo(x + barWidth - gap, y + 15);
      ctx.lineWidth = 1;
      ctx.strokeStyle = highlightGradient;
      ctx.stroke();

      if (db > 70) {
        ctx.shadowColor = 'rgba(124, 58, 237, 0.4)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(x + gap + (barWidth - gap * 2) / 2, y);
        ctx.lineTo(x + gap + (barWidth - gap * 2) / 2, y + 5);
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.6)';
        ctx.lineWidth = barWidth - gap * 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });
  }, [dbHistory]);

  return (
    <div className="w-full h-32 bg-white rounded-xl overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
      <canvas
        ref={canvasRef}
        width={600}
        height={128}
        className="w-full h-full"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 via-white/80 to-transparent pt-6 pb-2">
        <div className="flex justify-between text-xs font-medium px-4">
          <span className="text-purple-600/70 bg-purple-50 px-2 py-0.5 rounded-full">静かな環境</span>
          <span className="text-purple-600/70 bg-purple-50 px-2 py-0.5 rounded-full">普通の会話</span>
          <span className="text-purple-600/70 bg-purple-50 px-2 py-0.5 rounded-full">騒音</span>
        </div>
      </div>
    </div>
  );
}

WaveVisualizer.propTypes = {
  dbHistory: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default WaveVisualizer;
