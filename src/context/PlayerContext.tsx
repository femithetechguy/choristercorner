import React, { createContext, useContext, useState } from 'react';
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

  const play = (song: Song) => {
    setCurrentSong(song);
    setIsMinimized(false);
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
