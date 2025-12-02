import React, { createContext, useContext, useState, useRef } from 'react';
import { Song } from '@/types';

interface PlayerContextType {
  currentSong: Song | null;
  isMinimized: boolean;
  play: (song: Song) => void;
  close: () => void;
  toggleMinimize: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const lastPlayTimeRef = useRef(0);
  const PLAY_DEBOUNCE_MS = 300;

  const play = (song: Song) => {
    const now = Date.now();
    // Debounce: ignore if called within 300ms of last call with same song
    if (now - lastPlayTimeRef.current < PLAY_DEBOUNCE_MS && currentSong?.serial_number === song.serial_number) {
      console.log('⏱️ play() debounced - called too soon');
      return;
    }
    
    lastPlayTimeRef.current = now;
    console.log('🎵 play() called with:', song.title);
    
    // Always set the current song, but preserve the minimize state
    // Only auto-minimize if no song was playing before
    const wasPlaying = currentSong !== null;
    setCurrentSong(song);
    
    if (!wasPlaying) {
      // First song being played - expand by default
      setIsMinimized(false);
    }
    // If a song was already playing, keep the current minimize state
  };

  const close = () => {
    setCurrentSong(null);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isMinimized,
        play,
        close,
        toggleMinimize,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}
