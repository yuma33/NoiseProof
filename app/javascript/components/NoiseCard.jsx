import React from 'react';
import PropTypes from 'prop-types';
import WaveVisualizer from './WaveVisualizer';

function NoiseCard({ currentDb, averageDb, maxDb, dbHistory }) {
  const getNoiseCategory = (db) => {
    if (db < 40) return '静かな環境';
    if (db < 60) return '普通の会話レベル';
    if (db < 80) return '騒音レベル';
    return '非常にうるさい';
  };

  const getColor = (db) => {
    if (db < 40) return '#10B981'; // Green
    if (db < 60) return '#F97316'; // Orange
    if (db < 80) return '#EF4444'; // Red
    return '#EF4444'; // Red
  };

  // Calculate percentage for the circular progress
  const percentage = Math.min((currentDb / 120) * 100, 100);

  return (
    <section className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg transition-all duration-300">
      {/* Header */}
      <h2 className="text-gray-600 text-center font-medium mb-4">現在の音量レベル</h2>

      {/* Main circular display */}
      <div className="relative flex justify-center mb-5">
        <div className="w-40 h-40 rounded-full border-8 border-gray-100 flex items-center justify-center relative">
          {/* Circular progress background */}
          <div
            className="absolute inset-0 rounded-full transition-all duration-500"
            style={{
              background: `conic-gradient(${getColor(currentDb)} ${percentage}%, transparent ${percentage}%)`,
              opacity: 0.15
            }}
          />
          {/* Center content */}
          <div className="text-center z-10">
            <div
              className="text-4xl font-bold transition-colors duration-500"
              style={{ color: getColor(currentDb) }}
            >
              {currentDb}
              <span className="text-base font-normal text-gray-400 ml-1">dB</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 animate-fade-in">
              {getNoiseCategory(currentDb)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-3 text-center transition-all hover:shadow-md">
          <p className="text-xs text-gray-400 mb-1">平均音量</p>
          <p className="font-semibold text-gray-700">
            {averageDb} <span className="text-xs font-normal">dB</span>
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center transition-all hover:shadow-md">
          <p className="text-xs text-gray-400 mb-1">最大音量</p>
          <p className="font-semibold text-gray-700">
            {maxDb} <span className="text-xs font-normal">dB</span>
          </p>
        </div>
      </div>

      {/* Wave visualizer */}
      <div className="mt-4  border-gray-100">
        <WaveVisualizer dbHistory={dbHistory} mode="recording" />
      </div>
    </section>
  );
}

NoiseCard.propTypes = {
  currentDb: PropTypes.number.isRequired,
  averageDb: PropTypes.number.isRequired,
  maxDb: PropTypes.number.isRequired,
  dbHistory: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default NoiseCard;