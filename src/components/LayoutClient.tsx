'use client';

import { PlayerProvider } from '@/context/PlayerContext';
import VideoPlayer from '@/components/VideoPlayer';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlayerProvider>
      {children}
      <VideoPlayer />
    </PlayerProvider>
  );
}
