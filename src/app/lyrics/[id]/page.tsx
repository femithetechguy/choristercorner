'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Share2, Heart, Play } from 'lucide-react';
import { useState, useMemo } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Song, Hymn } from '@/types';
import songs from '@/data/songs.json';
import hymns from '@/data/hymns.json';

export default function LyricsPage() {
  const router = useRouter();
  const params = useParams();
  const { play } = usePlayer();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Parse ID and find song/hymn
  const songId = parseInt(params.id as string, 10);
  const item = useMemo(() => {
    const foundSong = (songs as Song[]).find((s: Song) => s.serial_number === songId);
    if (foundSong) return foundSong;
    const foundHymn = (hymns as Hymn[]).find((h: Hymn) => h.serial_number === songId);
    return foundHymn;
  }, [songId]) as Song | Hymn | undefined;

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Song not found</p>
        <button
          onClick={() => router.back()}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Check out "${item.title}" on ChoristerCorner!`,
          url: window.location.href,
        });
      } catch {
        console.log('Share cancelled or failed');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Back Button */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition font-semibold"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </div>

      {/* Song Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="inline-block text-xs font-semibold text-purple-600 uppercase bg-purple-100 px-3 py-1 rounded-full mb-3">
                Song #{item.serial_number}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {item.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span>By {item.channel}</span>
                </span>
                <span>{item.duration}</span>
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex gap-2">
              <button
                onClick={() => play(item as Song)}
                className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                title="Play"
              >
                <Play size={20} className="fill-current" />
              </button>
              <button
                onClick={handleShare}
                className="p-3 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition"
                title="Share"
              >
                <Share2 size={20} className="text-gray-600" />
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 rounded-lg transition ${
                  isFavorite
                    ? 'bg-red-100 text-red-600'
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  size={20}
                  className={isFavorite ? 'fill-current' : ''}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lyrics Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <span className="text-purple-600">🎵</span> Lyrics
        </h2>

        {item.lyrics && item.lyrics.length > 0 ? (
          <div className="bg-white rounded-lg shadow p-8 space-y-8">
            {item.lyrics.map((verse: string, idx: number) => (
              <div key={idx} className="text-gray-800">
                <p className="text-base leading-relaxed whitespace-pre-wrap font-medium">
                  {verse}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow text-center py-12">
            <p className="text-gray-500 text-lg">No lyrics available for this song</p>
          </div>
        )}
      </div>
    </main>
  );
}
