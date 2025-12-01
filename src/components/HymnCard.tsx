import { Hymn } from '@/types';
import Image from 'next/image';

interface HymnCardProps {
  hymn: Hymn;
  variant?: 'grid' | 'list';
}

export default function HymnCard({ hymn, variant = 'grid' }: HymnCardProps) {
  if (variant === 'list') {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition">
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={hymn.imageUrl}
            alt={hymn.title}
            fill
            className="object-cover rounded"
            unoptimized
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm">{hymn.title}</h3>
          <p className="text-xs text-gray-600">{hymn.author}</p>
          <p className="text-xs text-purple-600 mt-1">{hymn.category}</p>
          <div className="flex gap-2 mt-2">
            <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition">
              ▶
            </button>
            <button className="p-1 border rounded hover:bg-gray-50">📋</button>
            <button className="p-1 border rounded hover:bg-gray-50">🔗</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <div className="relative w-full h-48">
        <Image
          src={hymn.imageUrl}
          alt={hymn.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold text-purple-600">{hymn.category}</span>
        <h3 className="font-bold text-sm mt-2 line-clamp-2">{hymn.title}</h3>
        <p className="text-xs text-gray-600 mt-1">{hymn.author}</p>
        <div className="flex gap-2 mt-4 flex-wrap">
          <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition flex items-center gap-1">
            ▶
          </button>
          <button className="p-2 border rounded hover:bg-gray-50 transition">📋</button>
          <button className="p-2 border rounded hover:bg-gray-50 transition">🔗</button>
          <button className="p-2 border rounded hover:bg-gray-50 transition">📤</button>
          <button className="p-2 border rounded hover:bg-gray-50 transition">❤️</button>
        </div>
      </div>
    </div>
  );
}
