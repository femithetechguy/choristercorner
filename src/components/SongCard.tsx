'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Song } from '@/types';
import { Play, Copy, ExternalLink, FileText, Heart } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useState } from 'react';
import { createSlug } from '@/utils/slug';

interface SongCardProps {
  song: Song;
  variant?: 'grid' | 'list';
}

// Extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v') || url.split('v=')[1]?.split('&')[0] || '';
  } catch {
    return '';
  }
}

// Get YouTube thumbnail URL
function getYouTubeThumbnail(url: string): string {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export default function SongCard({ song, variant = 'grid' }: SongCardProps) {
  const router = useRouter();
  const { play } = usePlayer();
  const [isFavorite, setIsFavorite] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const thumbnailUrl = getYouTubeThumbnail(song.url);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    play(song);
  };

  const handleCopyLink = async () => {
    const slug = createSlug(song.title, song.serial_number, 'song');
    const lyricsUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/lyrics/${slug}`;
    try {
      await navigator.clipboard.writeText(lyricsUrl);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (variant === 'list') {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition bg-white animate-fade-in hover:scale-105 duration-300 origin-left">
        <div className="shrink-0 relative w-16 h-16 bg-gray-200 rounded overflow-hidden">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={song.title || 'Song thumbnail'}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-purple-100">
              <Play className="w-8 h-8 text-purple-600" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <div>
            <h3 className="font-bold text-sm text-gray-900 line-clamp-2">{song.title}</h3>
            <p className="text-xs text-gray-700 mt-1">{song.channel}</p>
            <p className="text-xs text-gray-600 mt-1">{song.duration}</p>
          </div>
          <div className="flex gap-2 mt-3">
            <button 
              onClick={handlePlay}
              className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              title="Play"
            >
              <Play size={14} className="fill-current" />
            </button>
            <button 
              onClick={() => router.push(`/lyrics/${createSlug(song.title, song.serial_number, 'song')}`)}
              className="p-2 border border-purple-200 rounded hover:bg-purple-50 transition"
              title="Show Lyrics"
            >
              <FileText size={14} className="text-purple-600" />
            </button>
            <button 
              className="p-2 border border-purple-200 rounded hover:bg-purple-50 transition"
              title="Copy Link"
              onClick={handleCopyLink}
            >
              <Copy size={14} className={`${copyFeedback ? 'text-green-500' : 'text-purple-600'}`} />
            </button>
            <a
              href={song.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-purple-200 rounded hover:bg-purple-50 transition"
              title="Open in new tab"
            >
              <ExternalLink size={14} className="text-purple-600" />
            </a>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 border border-purple-200 rounded hover:bg-purple-50 transition"
              title="Add to favorites"
            >
              <Heart size={14} className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-purple-600'}`} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col h-full animate-fade-in hover:scale-105 duration-300">
      <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={song.title || 'Song thumbnail'}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-purple-100">
            <Play className="w-12 h-12 text-purple-600" />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-purple-600 uppercase bg-purple-100 px-2 py-1 rounded">
            #{song.serial_number}
          </span>
        </div>
        <h3 className="font-bold text-sm line-clamp-2 text-gray-900">{song.title}</h3>
        <p className="text-xs text-gray-600 mt-2">{song.channel}</p>
        <p className="text-xs text-gray-500 mt-1">{song.duration}</p>
        <div className="flex gap-2 mt-4 justify-center">
          <button 
            onClick={handlePlay}
            className="p-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            title="Play"
          >
            <Play size={16} className="fill-current" />
          </button>
          <button 
            onClick={() => router.push(`/lyrics/${createSlug(song.title, song.serial_number, 'song')}`)}
            className="p-2.5 border border-purple-200 rounded-lg hover:bg-purple-50 transition"
            title="Show Lyrics"
          >
            <FileText size={16} className="text-purple-600" />
          </button>
          <button 
            className="p-2.5 border border-purple-200 rounded-lg hover:bg-purple-50 transition"
            title="Copy Link"
            onClick={handleCopyLink}
          >
            <Copy size={16} className={`${copyFeedback ? 'text-green-500' : 'text-purple-600'}`} />
          </button>
          <a
            href={song.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 border border-purple-200 rounded-lg hover:bg-purple-50 transition"
            title="Open in new tab"
          >
            <ExternalLink size={16} className="text-purple-600" />
          </a>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2.5 border border-purple-200 rounded-lg hover:bg-purple-50 transition"
            title="Add to favorites"
          >
            <Heart size={16} className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-purple-600'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
