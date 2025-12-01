import { Hymn } from '@/types';
import { Music, Copy, ExternalLink } from 'lucide-react';

interface HymnCardProps {
  hymn: Hymn;
  variant?: 'grid' | 'list';
}

export default function HymnCard({ hymn, variant = 'grid' }: HymnCardProps) {
  if (variant === 'list') {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition">
        <div className="w-16 h-16 shrink-0 bg-linear-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center">
          <Music className="w-8 h-8 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm text-gray-900">{hymn.title}</h3>
          <p className="text-xs text-gray-600">{hymn.author} ({hymn.year})</p>
          <p className="text-xs text-purple-600 mt-1">{hymn.category} • {hymn.duration}</p>
          <p className="text-xs text-gray-600 mt-1">{hymn.channel}</p>
          <div className="flex gap-2 mt-2">
            <a
              href={hymn.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Watch
            </a>
            <button className="p-1 border rounded hover:bg-gray-50 transition">
              <Copy className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <div className="w-full h-48 bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <Music className="w-16 h-16 text-purple-600 opacity-50" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-semibold text-purple-600">{hymn.category}</span>
          <span className="text-xs text-gray-500">{hymn.year}</span>
        </div>
        <h3 className="font-bold text-sm mt-2 line-clamp-2 text-gray-900">{hymn.title}</h3>
        <p className="text-xs text-gray-700 mt-1">{hymn.author}</p>
        <p className="text-xs text-gray-600 mt-1">{hymn.channel}</p>
        <p className="text-xs text-gray-600 mt-1">{hymn.duration}</p>
        <div className="flex gap-2 mt-4 flex-wrap">
          <a
            href={hymn.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition flex items-center gap-1"
          >
            <ExternalLink className="w-4 h-4" />
            Watch
          </a>
          <button className="p-2 border rounded hover:bg-gray-50 transition">
            <Copy className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
