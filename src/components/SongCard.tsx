'use client';

import Image from 'next/image';
import { Song } from '@/types';
import { Play, Copy, ExternalLink } from 'lucide-react';

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
  const thumbnailUrl = getYouTubeThumbnail(song.url);

  if (variant === 'list') {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition bg-white">
        <div className="shrink-0 relative w-16 h-16 bg-gray-200 rounded overflow-hidden">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={song.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-purple-100">
              <Play className="w-8 h-8 text-purple-600" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-gray-900 line-clamp-2">{song.title}</h3>
          <p className="text-xs text-gray-700 mt-1">{song.channel}</p>
          <p className="text-xs text-gray-600 mt-1">{song.duration}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <a
              href={song.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition flex items-center gap-1"
            >
              <Play size={12} /> Watch
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col h-full">
      <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={song.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-purple-100">
            <Play className="w-12 h-12 text-purple-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition flex items-center justify-center">
          <button className="bg-purple-600 p-3 rounded-full hover:bg-purple-700 transition">
            <Play className="w-6 h-6 text-white fill-white" />
          </button>
        </div>
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
        <div className="flex gap-2 mt-4 flex-wrap">
          <a
            href={song.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-xs hover:bg-purple-700 transition flex items-center justify-center gap-1"
          >
            <Play size={14} className="fill-current" /> Watch
          </a>
          <button 
            className="p-2 border border-purple-200 rounded hover:bg-purple-50 transition"
            title="Copy URL"
            onClick={() => navigator.clipboard.writeText(song.url)}
          >
            <Copy size={14} className="text-purple-600" />
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
        </div>
      </div>
    </div>
  );
}
