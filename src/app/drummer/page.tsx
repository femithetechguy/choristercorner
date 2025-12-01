'use client';

import { useState } from 'react';
import { Drum, Play, Pause } from 'lucide-react';

interface DrumPad {
  id: string;
  name: string;
  color: string;
}

export default function DrummerPage() {
  const [bpm, setBpm] = useState(105);
  const [isPlaying, setIsPlaying] = useState(false);

  const drumPads: DrumPad[] = [
    { id: 'kick', name: 'Kick', color: 'bg-blue-500' },
    { id: 'snare', name: 'Snare', color: 'bg-purple-500' },
    { id: 'hihat', name: 'Hi-Hat', color: 'bg-pink-500' },
    { id: 'tom1', name: 'Tom 1', color: 'bg-yellow-500' },
    { id: 'tom2', name: 'Tom 2', color: 'bg-green-500' },
    { id: 'tom3', name: 'Tom 3', color: 'bg-red-500' },
    { id: 'crash', name: 'Crash', color: 'bg-indigo-500' },
    { id: 'ride', name: 'Ride', color: 'bg-orange-500' },
  ];

  const handlePadClick = (padId: string) => {
    // Play drum sound - can integrate with web audio API or audio files
    console.log(`Playing: ${padId}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Drum className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Drum Machine</h1>
          <p className="text-gray-600">
            Practice with professional drum patterns and rhythms. Perfect for worship teams, choir
            practice, and personal rhythm training.
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* BPM Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BPM</label>
              <input
                type="number"
                value={bpm}
                onChange={e => setBpm(Math.max(40, Math.min(300, parseInt(e.target.value))))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-lg font-bold"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">{bpm} bpm</p>
            </div>

            {/* Groove Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Groove</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>4/4 Straight</option>
                <option>4/4 Swing</option>
                <option>Gospel</option>
                <option>Latin</option>
                <option>Funk</option>
              </select>
            </div>

            {/* Style Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>Worship</option>
                <option>Jazz</option>
                <option>Rock</option>
                <option>Pop</option>
                <option>Classical</option>
              </select>
            </div>
          </div>

          {/* Play Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-8 py-3 rounded-lg font-bold text-white transition ${
                isPlaying
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isPlaying ? '⏸ Stop' : '▶ Play'}
            </button>
            <button className="px-8 py-3 rounded-lg font-bold text-white bg-gray-600 hover:bg-gray-700 transition">
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Drum Pads */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">Drum Pads</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {drumPads.map(pad => (
              <button
                key={pad.id}
                onClick={() => handlePadClick(pad.id)}
                className={`${pad.color} text-white font-bold py-8 rounded-lg hover:opacity-80 transition active:scale-95 transform`}
              >
                <div className="text-2xl">{pad.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="font-bold mb-2">Multiple patterns</h3>
            <p className="text-sm text-gray-600">Various drum patterns for different styles</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="font-bold mb-2">Worship styles</h3>
            <p className="text-sm text-gray-600">Specialized patterns for worship music</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="font-bold mb-2">Loop control</h3>
            <p className="text-sm text-gray-600">Easy loop and pattern management</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="font-bold mb-2">Volume control</h3>
            <p className="text-sm text-gray-600">Individual and master volume adjustments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
