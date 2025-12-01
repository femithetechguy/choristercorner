import { Song } from '@/types';
import Image from 'next/image';

interface SongCardProps {
  song: Song;
  variant?: 'grid' | 'list';
}

export default function SongCard({ song, variant = 'grid' }: SongCardProps) {
  if (variant === 'list') {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition">
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={song.imageUrl}
            alt={song.title}
            fill
            className="object-cover rounded"
            unoptimized
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm">{song.title}</h3>
          <p className="text-xs text-gray-600">{song.artist}</p>
          <p className="text-xs text-gray-500">{song.duration}</p>
          <button className="mt-2 bg-purple-600 text-white px-4 py-1 rounded text-sm hover:bg-purple-700 transition">
            Listen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <div className="relative w-full h-48">
        <Image
          src={song.imageUrl}
          alt={song.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm line-clamp-2">{song.title}</h3>
        <p className="text-xs text-gray-600 mt-1">{song.artist}</p>
        <p className="text-xs text-gray-500 mt-1">{song.duration}</p>
        <div className="flex gap-2 mt-4">
          <button className="flex-1 bg-purple-600 text-white py-2 rounded text-sm hover:bg-purple-700 transition flex items-center justify-center gap-2">
            <span>▶</span> Listen
          </button>
          <button className="p-2 border rounded hover:bg-gray-50 transition">
            📋
          </button>
        </div>
      </div>
    </div>
  );
}
