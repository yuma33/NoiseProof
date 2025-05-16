import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function WaveVisualizer({ dbHistory, currentIndex, mode = "recording" }) {
  const canvasRef = useRef(null);
  const DB_BASELINE = 30;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    const barWidth = width / 120;
    const gap = 1;

    // 背景リセット
    ctx.clearRect(0, 0, width, height);

    // 背景グラデーション
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#f3e8ff');
    bgGradient.addColorStop(1, '#faf5ff');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // dB目盛り線とラベル描画（30〜90dB）
    [50, 70, 90].forEach(db => {
      const y = height - ((db - DB_BASELINE) / 100) * height;

      ctx.strokeStyle = '#e5e7eb'; // 薄いグレーの線
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    });

    // 録音モードの波形描画
    if (mode === "recording") {
      dbHistory.forEach((db, i) => {
        const relativeDb = Math.max(0, db - DB_BASELINE);
        const x = width - (i * barWidth);
        const barHeight = (relativeDb / 100) * height;
        const y = height - barHeight;

        ctx.fillStyle = '#a855f7';
        ctx.fillRect(x + gap, y, barWidth - gap * 2, barHeight);
      });

    // 再生モードの波形描画
    } else if (mode === "playback") {
      const centerX = width / 2;

      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.strokeStyle = 'rgba(126, 34, 206, 1.0)';
      ctx.lineWidth = 3;
      ctx.stroke();

      dbHistory.slice().reverse().forEach((db, i) => {
        const relativeDb = Math.max(0, db - DB_BASELINE);
        const relativeIndex = i - currentIndex;
        const x = centerX + relativeIndex * barWidth;
        if (x < 0 || x > width) return;

        const barHeight = (relativeDb / 100) * height;
        const y = height - barHeight;

        ctx.fillStyle = '#a855f7';
        ctx.fillRect(x + gap, y, barWidth - gap * 2, barHeight);
      });
    }
  }, [dbHistory, currentIndex, mode]);

  return (
    <div className="w-full h-32 rounded-sm bg-gradient-to-br from-purple-100 to-purple-200 relative mb-3">
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
  currentIndex: PropTypes.number,
  mode: PropTypes.oneOf(["recording", "playback"]),
};

WaveVisualizer.defaultProps = {
  currentIndex: -1,
  mode: "recording",
};

export default WaveVisualizer;
