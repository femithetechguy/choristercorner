import { Song } from '@/types';
import { Music, Copy, ExternalLink } from 'lucide-react';

interface SongCardProps {
  song: Song;
  variant?: 'grid' | 'list';
}

export default function SongCard({ song, variant = 'grid' }: SongCardProps) {
  if (variant === 'list') {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition bg-white">
        <div className="shrink-0 pt-2">
          <Music className="w-8 h-8 text-purple-600" />
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
              <ExternalLink size={12} /> Watch
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col">
      <div className="w-full h-40 bg-linear-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <Music className="w-16 h-16 text-purple-300" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-sm line-clamp-2 text-gray-900">{song.title}</h3>
        <p className="text-xs text-gray-600 mt-2">{song.channel}</p>
        <p className="text-xs text-gray-500 mt-1">{song.duration}</p>
        <div className="flex gap-2 mt-4 flex-wrap">
          <a
            href={song.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-fit bg-purple-600 text-white px-3 py-2 rounded text-xs hover:bg-purple-700 transition flex items-center justify-center gap-1"
          >
            <ExternalLink size={14} /> Watch
          </a>
          <button className="p-2 border rounded hover:bg-gray-50 transition" title="Copy URL">
            <Copy size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
