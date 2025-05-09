// NoisePlayer.jsx
import React, { useEffect, useState, useRef } from 'react';
import WaveVisualizer from './WaveVisualizer';

function NoisePlayer({ id }) {
  const [audioUrl, setAudioUrl] = useState('');
  const [dbHistory, setDbHistory] = useState([]);
  const [currentDbIndex, setCurrentDbIndex] = useState(0);
  const audioRef = useRef(null);
  const [duration, setDuration] = useState(0); // 録音時間（秒）
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch(`/api/recordings/${id}`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        console.log('録音データを取得:', data);
        setAudioUrl(data.audio_url);
        setDuration(data.duration || 0);
        const adjustedHistory = data.db_history.map(value => value + 83);
        setDbHistory(adjustedHistory);
      });
  }, [id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (dbHistory.length === 0 || !duration) return;

      const currentTime = audio.currentTime;
      const progress = currentTime / duration;
      console.log(`再生位置: ${currentTime.toFixed(2)}/${duration.toFixed(2)}`);

      // インデックス計算
      let index = progress * dbHistory.length;
      //if (duration >= 1) {
        //const delayFactor = 0.03; // 遅延係数（0.4 = 40%遅らせる）
        //index = index * (1 + delayFactor);
      //}

      const newIndex = Math.min(Math.floor(index), dbHistory.length - 1);
      console.log(`インデックス: ${newIndex} / ${dbHistory.length - 1}`);
      setCurrentDbIndex(newIndex);
    };

    const handlePlay = () => {
      console.log('再生開始');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('再生停止');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [dbHistory, duration]);

  return (
    <div className="p-5">
      <WaveVisualizer
        dbHistory={dbHistory}
        currentIndex={currentDbIndex}
        mode="playback"
        duration={duration}
      />
      <audio 
        ref={audioRef} 
        controls 
        src={audioUrl} 
        className="mt-4 w-full" 
      />
      {duration ? (
        <div className="text-sm text-gray-500 mt-1">
          録音時間: {Math.floor(duration / 60)}分{Math.round(duration % 60)}秒
        </div>
      ) : null}
    </div>
  );
}

export default NoisePlayer;

