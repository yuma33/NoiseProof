import React from 'react';
import PropTypes from 'prop-types';
import WaveVisualizer from './WaveVisualizer';

function NoiseCard({ currentDb, dbHistory }) {
  const getNoiseCategory = (db) => {
    if (db < 40) return '静かな環境';
    if (db < 60) return '普通の会話レベル';
    if (db < 80) return '騒音レベル';
    return 'Very loud';
  };

  const getTextColor = (db) => {
    if (db < 40) return 'text-green-300';
    if (db < 60) return 'text-orange-400';
    if (db < 80) return 'text-red-300';
    return 'text-red-600';
  };

  return (
    <section className="bg-white rounded-xl p-5 shadow-md transition-all duration-200">
      <h2 className="text-gray-600 text-center font-medium">現在の音量レベル</h2>

      <div className="text-center my-4">
        <div className={`text-5xl font-bold ${getTextColor(currentDb)}`}>
          {currentDb}
          <span className="text-lg font-normal text-gray-500 ml-1">dB</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{getNoiseCategory(currentDb)}</p>
      </div>

      <div className="mt-6">
        <WaveVisualizer dbHistory={dbHistory} />
      </div>
    </section>
  );
}

NoiseCard.propTypes = {
  currentDb: PropTypes.number.isRequired,
  dbHistory: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default NoiseCard;
