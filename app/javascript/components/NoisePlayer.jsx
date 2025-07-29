// NoisePlayer.jsx
import React, { useEffect, useState, useRef } from 'react';
import WaveVisualizer from './WaveVisualizer';

function NoisePlayer({ id }) {
  const [audioUrl, setAudioUrl] = useState(null);
  const [dbHistory, setDbHistory] = useState([]);
  const [currentDbIndex, setCurrentDbIndex] = useState(0);
  const audioRef = useRef(null);
  const [duration, setDuration] = useState(0); // 録音時間（秒）

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
        setDbHistory(data.db_history);
      });
  }, [id]);

  // audio.addEventListener('timeupdate', handleTimeUpdate);ここで音声の再生位置が変わるたびにhandleTimeUpdateが発火する
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
      // if (progress >= 70) {
      //   const delayFactor = 0.01; // 遅延係数（0.4 = 40%遅らせる）
      //   index = index * (1 + delayFactor);
      // }

      const newIndex = Math.min(index, dbHistory.length - 1);
      console.log(`インデックス: ${newIndex} / ${dbHistory.length - 1}`);
      setCurrentDbIndex(newIndex);
    };

    const handlePlay = () => {
      console.log('再生開始');
    };

    const handlePause = () => {
      console.log('再生停止');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate); //音声の再生位置が変わるたびに発火
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
//dbHistory,duration が変わるたびに timeupdate イベントが追加され続けるから必要になる。
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
        ref={audioRef} //audioRef.current = 実DOMノード;のような形に変換されてる
        controls
        src={audioUrl}
        className="mt-4 w-full"
      />
    </div>
  );
}

export default NoisePlayer;
