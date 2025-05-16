import React, { useState, useEffect, useRef } from 'react';
import NoiseCard from './NoiseCard';
import { Mic, Square, Clock } from 'lucide-react';

function NoiseProof() {
  const token = document.querySelector('meta[name="csrf-token"]').content;
  const [recording, setRecording] = useState(false);
  const [recordingStopped, setRecordingStopped] = useState(false);
  const [currentDb, setCurrentDb] = useState(0);
  const [timer, setTimer] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordedAt, setRecordedAt] = useState(null);
  const [fullDbHistory, setFullDbHistory] = useState([]);
  const [averageDb, setAverageDb] = useState(0);
  const [exactDuration, setExactDuration] = useState(0); // 正確な録音時間（秒単位、小数点以下も保持）

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const streamRef = useRef(null);
  const recordingStartTimeRef = useRef(0); // 録音開始時刻を保存するref
  const dbIntervalRef = useRef(null);
  const secondsRef = useRef(0);

  // 位置情報・確認モーダル関連の状態
  const [locationConfirmationVisible, setLocationConfirmationVisible] = useState(false);
  const [neverAskAgain, setNeverAskAgain] = useState(false);

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
      analyserRef.current.fftSize = 32768;

      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
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
        const db = 20 * Math.log10(Math.max(rms, 0.000016));
        const displayDb = Math.max(0, parseFloat((db + 83).toFixed(1)));
        setCurrentDb(displayDb);

        if (displayDb > 0) {
          setFullDbHistory(prev => [displayDb, ...prev]);
        }
      };

      dbIntervalRef.current = setInterval(updateDbLevel, 125);

      recordingStartTimeRef.current = performance.now();

      timerIntervalRef.current = setInterval(() => {
        secondsRef.current += 1;
        setTimer(secondsRef.current);
      }, 1000);

      mediaRecorderRef.current.start(10);
      setRecording(true);
      setRecordingStopped(false);

      return () => {
        clearInterval(dbIntervalRef.current);
      };
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Microphone access not allowed');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setRecordingStopped(true);
      setRecordedAt(new Date().toISOString());
      streamRef.current.getTracks().forEach(track => track.stop());

      const recordingEndTime = performance.now();
      const durationMs = recordingEndTime - recordingStartTimeRef.current;
      const durationSec = durationMs / 1000;
      setExactDuration(durationSec);

      if (dbIntervalRef.current) {
        clearInterval(dbIntervalRef.current);
        dbIntervalRef.current = null;
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  // 実際のデータ送信処理を別関数に分離
  const sendRecordingData = (coords = null) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('duration', exactDuration);
    formData.append('recorded_at', recordedAt);
    formData.append('max_decibel', Math.max(...fullDbHistory));
    formData.append('average_decibel', averageDb);
    formData.append('db_history', JSON.stringify(fullDbHistory));

    // 位置情報があれば追加
    if (coords) {
      formData.append('latitude', coords.latitude);
      formData.append('longitude', coords.longitude);
    }

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

    // 録音関連の状態をリセット
    setRecordingStopped(false);
    setAudioBlob(null);
    setTimer(0);
    setExactDuration(0);
    setFullDbHistory([]);
    setCurrentDb(0);
    setAverageDb(0);
    secondsRef.current = 0;
  };

  // 位置情報取得関数
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert('お使いのブラウザは位置情報に対応していません');
      sendRecordingData(); // 位置情報が取得できなくても録音は保存
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('位置情報取得成功:', position);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

    // 👇 ここで直接渡す。setCoordinates は不要（or UI用に使ってもOK）
    sendRecordingData({ latitude: lat, longitude: lng });
  },
      (error) => {
        console.error('位置情報取得失敗:', error);
        sendRecordingData(); // 位置情報の取得に失敗しても録音は保存
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }
    );
  };

  // 保存ボタンを押した時の処理（リファクタリング）
  const saveRecording = () => {
    const skip = localStorage.getItem('neverAskLocationAgain');
    if (skip === 'true') {
      // 位置情報を尋ねないように設定されている場合は直接送信
      sendRecordingData();
    } else {
      // 位置情報確認モーダルを表示
      setLocationConfirmationVisible(true);
    }
  };

  const discardRecording = () => {
    setRecordingStopped(false);
    setAudioBlob(null);
    audioChunksRef.current = [];
    setTimer(0);
    setExactDuration(0);
    setFullDbHistory([]);
    setCurrentDb(0);
    setAverageDb(0);
    secondsRef.current = 0;
  };

  useEffect(() => {
    if (fullDbHistory.length > 0) {
      const total = fullDbHistory.reduce((acc, val) => acc + parseFloat(val), 0);
      const avg = total / fullDbHistory.length;
      const avgRounded = Number(avg.toFixed(1));
      setAverageDb(avgRounded);
    }
  }, [fullDbHistory]);



  
  useEffect(() => {
    console.log("🔁 averageDb updated:", averageDb);
  }, [averageDb]);

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
    <div className="flex flex-col bg-purple-50">
      <main className="flex-1 p-4 space-y-4 max-w-5xl mx-auto w-full">
        <NoiseCard currentDb={currentDb}
          averageDb={averageDb}
          maxDb={fullDbHistory.length > 0 ? Math.max(...fullDbHistory) : 0}
          dbHistory={fullDbHistory} />

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
            {exactDuration > 0 && recordingStopped && (
              <p className="text-xs text-gray-400">
                正確な録音時間: {exactDuration.toFixed(3)}秒
              </p>
            )}
          </div>
        </section>
      </main>

      {/* 位置情報確認モーダル */}
      {locationConfirmationVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">⏺️ 録音に位置情報を連携しますか？</h2>
            <p className="mb-4 text-sm text-gray-600">
            この録音に位置情報を付加して保存できます。<br />
            証明書を発行する際など、客観的な記録として有効です。
            </p>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={neverAskAgain}
                onChange={(e) => {
                  setNeverAskAgain(e.target.checked);
                  localStorage.setItem('neverAskLocationAgain', e.target.checked ? 'true' : 'false');
                }}
                className="mr-2"
              />
              今後この確認を表示しない
            </label>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setLocationConfirmationVisible(false);
                  sendRecordingData(); // 位置情報なしで送信
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                記録しない
              </button>
              <button
                onClick={() => {
                  setLocationConfirmationVisible(false);
                  requestLocation(); // 位置情報取得して送信
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                位置情報を記録する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoiseProof;