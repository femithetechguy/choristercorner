'use client';

import { useState, useRef, useEffect } from 'react';
import { Clock, Play, Pause } from 'lucide-react';

export default function MetronomePage() {
  const [bpm, setBpm] = useState(127);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSignature, setTimeSignature] = useState('4/4');
  const [tempo, setTempo] = useState('Allegro');
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const scheduleAheadTimeRef = useRef(0.1);
  const lookAheadTimeRef = useRef(25.0);
  const noteResolutionRef = useRef(0);
  const timerIDRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (timerIDRef.current) clearTimeout(timerIDRef.current);
    };
  }, []);

  const playClick = () => {
    if (!audioContextRef.current) return;
    const now = audioContextRef.current.currentTime;
    const osc = audioContextRef.current.createOscillator();
    const env = audioContextRef.current.createGain();

    osc.connect(env);
    env.connect(audioContextRef.current.destination);

    osc.frequency.value = 800;
    osc.type = 'sine';

    env.gain.setValueAtTime(0.3, now);
    env.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  };

  const toggleMetronome = () => {
    if (!isPlaying) {
      audioContextRef.current?.resume();
      nextNoteTimeRef.current = audioContextRef.current?.currentTime || 0;
      scheduler();
    } else {
      if (timerIDRef.current) clearTimeout(timerIDRef.current);
    }
    setIsPlaying(!isPlaying);
  };

  const scheduler = () => {
    while (
      nextNoteTimeRef.current <
      (audioContextRef.current?.currentTime || 0) + scheduleAheadTimeRef.current
    ) {
      scheduleNote(noteResolutionRef.current++);
      const secondsPerBeat = (60.0 / bpm) * 4;
      nextNoteTimeRef.current += secondsPerBeat;
    }
    if (isPlaying) {
      timerIDRef.current = setTimeout(scheduler, lookAheadTimeRef.current);
    }
  };

  const scheduleNote = (beatNumber: number) => {
    const timeSignatureNum = parseInt(timeSignature.split('/')[0]);
    if (beatNumber % timeSignatureNum === 0) {
      playClick();
    }
  };

  const handleBpmChange = (value: number) => {
    setBpm(value);
    // Update tempo based on BPM
    if (value < 60) setTempo('Largo');
    else if (value < 76) setTempo('Adagio');
    else if (value < 108) setTempo('Andante');
    else if (value < 120) setTempo('Moderato');
    else if (value < 156) setTempo('Allegro');
    else setTempo('Presto');
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Clock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Metronome</h1>
          <p className="text-gray-600">
            Keep perfect time with our professional metronome. Ideal for worship practice, choir
            rehearsals, and personal practice sessions.
          </p>
        </div>

        {/* Main Controls */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* BPM Display */}
          <div className="text-center mb-8">
            <div className="text-lg text-gray-600 mb-2">Tempo</div>
            <div className="text-5xl font-bold text-purple-600 mb-2">{bpm}</div>
            <div className="text-gray-600">
              <span className="font-semibold">{tempo}</span> bpm
            </div>
          </div>

          {/* BPM Slider */}
          <div className="mb-8">
            <input
              type="range"
              min="40"
              max="300"
              value={bpm}
              onChange={e => handleBpmChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled={isPlaying}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>40</span>
              <span>300</span>
            </div>
          </div>

          {/* Play Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={toggleMetronome}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition text-white ${
                isPlaying
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isPlaying ? '⏸ Stop' : '▶ Start'}
            </button>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-4">
            {/* Time Signature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Signature
              </label>
              <select
                value={timeSignature}
                onChange={e => setTimeSignature(e.target.value)}
                disabled={isPlaying}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option>2/4</option>
                <option>3/4</option>
                <option>4/4</option>
                <option>6/8</option>
                <option>12/8</option>
              </select>
            </div>

            {/* Beat Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beat</label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                <div className="text-2xl">1</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="font-bold mb-2">Adjustable BPM</h3>
            <p className="text-sm text-gray-600">Range from 40-300 bpm for any tempo</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="font-bold mb-2">Time signatures</h3>
            <p className="text-sm text-gray-600">Multiple time signature options</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="font-bold mb-2">Tap tempo</h3>
            <p className="text-sm text-gray-600">Set tempo by tapping the beat</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="font-bold mb-2">Visual indicators</h3>
            <p className="text-sm text-gray-600">See the beat with visual feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
}
