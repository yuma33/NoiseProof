import React, { useState, useEffect, useRef } from 'react';
import NoiseCard from './NoiseCard';
import { Mic, Square, Clock } from 'lucide-react';

function NoiseProof() {
  const token = document.querySelector('meta[name="csrf-token"]').content;
  const [recording, setRecording] = useState(false);
  const [recordingStopped, setRecordingStopped] = useState(false);
  const [currentDb, setCurrentDb] = useState(33);
  const [timer, setTimer] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordedAt, setRecordedAt] = useState(null);
  const [fullDbHistory, setFullDbHistory] = useState([]);
  const [averageDb, setAverageDb] = useState(0);
  const [dbHistory, setDbHistory] = useState(Array(60).fill(0).map(() => Math.floor(Math.random() * 60 + 20)));

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const streamRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log("MediaRecorder has stopped.");
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
      };

      const updateDbLevel = () => {
        if (!analyserRef.current) return;
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteTimeDomainData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const normalized = (dataArray[i] / 128) - 1.0;
          sum += normalized * normalized;
        }
        const rms = Math.sqrt(sum / bufferLength);
        const db = Math.round(rms * 100);
        setCurrentDb(db);

        setDbHistory(prev => {
          setFullDbHistory(prev => [...prev, db]);
          const total = fullDbHistory.reduce((acc, val) => acc + val, 0);
          const avg = fullDbHistory.length > 0 ? Math.round(total / fullDbHistory.length) : 0;
          setAverageDb(avg);

          const newHistory = [...prev, db];
          return newHistory.length > 60 ? newHistory.slice(-60) : newHistory;
        });
      };

      const dbInterval = setInterval(updateDbLevel, 100);

      let seconds = 0;
      timerIntervalRef.current = setInterval(() => {
        seconds += 1;
        setTimer(seconds);
      }, 1000);

      mediaRecorderRef.current.start(10);
      setRecording(true);
      setRecordingStopped(false);

      return () => {
        clearInterval(dbInterval);
      };
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Microphone access not allowed');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      console.log("Recorder state:", mediaRecorderRef.current.state);
      mediaRecorderRef.current.stop();
      setRecording(false);
      setRecordingStopped(true);
      setRecordedAt(new Date().toISOString());
      streamRef.current.getTracks().forEach(track => track.stop());

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  const saveRecording = () => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('duration', timer);
    formData.append('recorded_at', recordedAt);
    formData.append('max_decibel', Math.max(...fullDbHistory));
    formData.append('average_decibel', averageDb);

    fetch('/api/recordings', {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'X-CSRF-Token': token
      }
    })
      .then(response => response.json())
      .then(data => console.log('Recording saved:', data))
      .catch(error => console.error('Error saving recording:', error));

    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    streamRef.current.getTracks().forEach(track => track.stop());

    setRecordingStopped(false);
    setAudioBlob(null);
    setTimer(0);
  };

  const discardRecording = () => {
    setRecordingStopped(false);
    setAudioBlob(null);
    audioChunksRef.current = [];
    setTimer(0);
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1 p-4 space-y-4 max-w-5xl mx-auto w-full">
        <NoiseCard currentDb={currentDb} dbHistory={dbHistory} />

        <section className="bg-white rounded-xl p-5 shadow-md transition-all duration-200">

          <div className="flex flex-col items-center gap-4">
            <div className="text-3xl flex items-center mb-2 mr-5">
              <Clock size={25} className="mr-2" />
              {formatTime(timer)}
            </div>
            <button
              className={`w-20 h-20 rounded-full flex items-center justify-center focus:outline-none shadow-lg transition-all duration-300 ${recording ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:bg-purple-700'
                }`}
              onClick={recording ? stopRecording : startRecording}
            >
              <span className="text-3xl">
                {recording ? <Square size={40} className="text-white" /> : <Mic size={40} className="text-white" />}
              </span>
            </button>

            {recordingStopped && (
              <div className="flex items-center gap-4">
                <button onClick={discardRecording} className="focus:outline-none shadow-lg transition-all duration-300 bg-gray-200 hover:bg-gray-300 w-20 h-10 rounded-3xl">破棄</button>
                <button onClick={saveRecording} className="focus:outline-none shadow-lg transition-all duration-300 bg-blue-600 hover:bg-blue-700 w-20 h-10 rounded-3xl text-white">保存</button>
              </div>
            )}

            <p className="text-sm text-gray-500 mt-2">
              {recording ? 'Recording in progress...' : '録音ボタンを押して騒音の記録を開始します'}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default NoiseProof;
