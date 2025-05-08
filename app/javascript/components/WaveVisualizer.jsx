import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function WaveVisualizer({ dbHistory, currentIndex, mode = "recording" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    const barWidth = width / 200;
    const gap = 2;

    // 背景リセット
    ctx.clearRect(0, 0, width, height);
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#f3e8ff');
    bgGradient.addColorStop(1, '#faf5ff');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    if (mode === "recording") {
      // 録音中：左から右に波形が伸びる
      dbHistory.forEach((db, i) => {
        const x = i * barWidth;
        const barHeight = (db / 100) * height * 1.2;
        const y = height - barHeight;

        const barGradient = ctx.createLinearGradient(x, y, x, height);
        barGradient.addColorStop(1, '#c084fc');
        barGradient.addColorStop(0, '#a855f7');

        ctx.fillStyle = barGradient;
        ctx.fillRect(x + gap, y, barWidth - gap * 2, barHeight);
      });

    } else if (mode === "playback") {
      // 再生中：中央に棒、波形が左右に流れる
      const centerX = width / 2;

      // 中央線（現在の再生位置）を描画
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.strokeStyle = 'rgba(126, 34, 206, 1.0)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 再生中の波形を描画（中央線を基準に）
      dbHistory.forEach((db, i) => {
        const relativeIndex = i - currentIndex;
        const x = centerX + relativeIndex * barWidth;
        if (x < 0 || x > width) return;

        const barHeight = (db / 100) * height * 1.2;
        const y = height - barHeight;

        const barGradient = ctx.createLinearGradient(x, y, x, height);
        barGradient.addColorStop(1, '#c084fc');
        barGradient.addColorStop(0, '#a855f7');

        ctx.fillStyle = barGradient;
        ctx.fillRect(x + gap, y, barWidth - gap * 2, barHeight);
      });
    }
  }, [dbHistory, currentIndex, mode]);

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
  currentIndex: PropTypes.number,
  mode: PropTypes.oneOf(["recording", "playback"]),
};

WaveVisualizer.defaultProps = {
  currentIndex: -1,
  mode: "recording",
};

export default WaveVisualizer;


