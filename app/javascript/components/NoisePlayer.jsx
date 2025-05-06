import React, { useEffect, useState, useRef } from 'react';
import WaveVisualizer from './WaveVisualizer';

function NoisePlayer({ id }) {
  const [audioUrl, setAudioUrl] = useState('');
  const [dbHistory, setDbHistory] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch(`/api/recordings/${id}`)
      .then(res => res.json())
      .then(data => {
        setAudioUrl(data.audio_url);
        setDbHistory(data.db_history);
      });
  }, [id]);

  return (
    <div className="p-5">
      <WaveVisualizer dbHistory={dbHistory} />
      <audio ref={audioRef} controls src={audioUrl} className="mt-4 w-full" />
    </div>
  );
}

export default NoisePlayer;
