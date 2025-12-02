'use client';

import { usePlayer } from '@/context/PlayerContext';
import MediaPlayer from './MediaPlayer';
import HymnSearch from './HymnSearch';

export default function HymnPlayer() {
  const { currentSong, close } = usePlayer();

  // Only show if current song is a hymn (has author property)
  if (!currentSong || !('author' in currentSong)) return null;

  return (
    <MediaPlayer
      media={currentSong}
      onClose={close}
      SearchComponent={HymnSearch}
    />
  );
}
