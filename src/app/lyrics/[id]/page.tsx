'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Share2, Heart, Play } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Song, Hymn } from '@/types';
import songs from '@/data/songs.json';
import hymns from '@/data/hymns.json';
import { extractSerialFromSlug, parseSlug } from '@/utils/slug';
import { parseLyricsWithTags } from '@/utils/lyrics';

// Helper function to get YouTube thumbnail
function getYouTubeThumbnail(url: string): string {
  try {
    const videoId = new URL(url).searchParams.get('v') || url.split('v=')[1]?.split('&')[0] || '';
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  } catch {
    return '';
  }
}

export default function LyricsPage() {
  const router = useRouter();
  const params = useParams();
  const { play } = usePlayer();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Parse slug to get serial number and type
  const slug = params.id as string;
  const parsedSlug = useMemo(() => parseSlug(slug), [slug]);
  
  const songId = useMemo(() => {
    return extractSerialFromSlug(slug, songs as Song[], hymns as Hymn[]);
  }, [slug]);
  
  const item = useMemo(() => {
    if (!songId) return undefined;
    
    // If it's a serial-based slug with explicit type, search that type ONLY
    if (parsedSlug?.type === 'serial' && parsedSlug?.itemType === 'hymn') {
      return (hymns as Hymn[]).find((h: Hymn) => h.serial_number === songId);
    }
    
    if (parsedSlug?.type === 'serial' && parsedSlug?.itemType === 'song') {
      return (songs as Song[]).find((s: Song) => s.serial_number === songId);
    }
    
    // Title-based slug: search songs first, then hymns
    const foundSong = (songs as Song[]).find((s: Song) => s.serial_number === songId);
    if (foundSong) return foundSong;
    return (hymns as Hymn[]).find((h: Hymn) => h.serial_number === songId);
  }, [songId, parsedSlug]) as Song | Hymn | undefined;

  // Determine if it's a song or hymn
  const isHymn = item && 'author' in item;
  const itemType = isHymn ? 'Hymn' : 'Song';
  const creator = item && (isHymn ? (item as Hymn).author : (item as Song).channel);

  // Set Open Graph meta tags for social sharing
  useEffect(() => {
    if (!item) return;

    const thumbnail = getYouTubeThumbnail(item.url);
    const description = `Listen to "${item.title}" on ChoristerCorner. Music channel: ${item.channel}. Duration: ${item.duration}`;
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    // Update meta tags
    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateNameTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update title
    document.title = `${item.title} - ChoristerCorner`;

    // Open Graph tags (for Facebook, Twitter, LinkedIn, etc.)
    updateMetaTag('og:title', item.title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', thumbnail);
    updateMetaTag('og:url', currentUrl);
    updateMetaTag('og:type', 'music.song');

    // Twitter Card tags
    updateNameTag('twitter:card', 'summary_large_image');
    updateNameTag('twitter:title', item.title);
    updateNameTag('twitter:description', description);
    updateNameTag('twitter:image', thumbnail);

    // Additional meta tags
    updateNameTag('description', description);
  }, [item]);

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
    <main className="min-h-screen bg-gray-50 pb-24 flex flex-col">
      {/* Back Button */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition font-semibold text-sm sm:text-base"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </div>

      {/* Song Header - Compact on Mobile */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <span className="inline-block text-xs font-semibold text-purple-600 uppercase bg-purple-100 px-2 py-1 rounded-full mb-2 sm:mb-3 text-xs">
                {itemType} #{item.serial_number}
              </span>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                {item.title}
              </h1>
              <div className="flex flex-col gap-1 sm:gap-2 sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span>By {creator}</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span>{item.duration}</span>
              </div>
            </div>

            {/* Action Icons - Smaller on Mobile */}
            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => play(item as Song)}
                className="p-2 sm:p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                title="Play"
              >
                <Play size={18} className="sm:w-5 sm:h-5 fill-current" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 sm:p-3 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition"
                title="Share"
              >
                <Share2 size={18} className="sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 sm:p-3 rounded-lg transition ${
                  isFavorite
                    ? 'bg-red-100 text-red-600'
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  size={18}
                  className={`sm:w-5 sm:h-5 ${isFavorite ? 'fill-current' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lyrics Content - Full Height on Mobile */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-12">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-8 flex items-center gap-2">
          <span className="text-purple-600">🎵</span> Lyrics
        </h2>

        {item.lyrics && item.lyrics.length > 0 ? (
          <div className="bg-white rounded-lg shadow p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(100vh-300px)] sm:max-h-none">
            {parseLyricsWithTags(item.lyrics).map((verseData: { isTag: boolean; tag: string | null; content: string }, idx: number) => (
              <div key={idx}>
                {verseData.isTag && (
                  <p className="text-sm sm:text-base font-bold text-purple-600 mb-2 sm:mb-3 bg-purple-50 px-2 sm:px-3 py-1 sm:py-2 rounded inline-block">
                    {verseData.tag}
                  </p>
                )}
                <p className="text-sm sm:text-base leading-relaxed sm:leading-relaxed whitespace-pre-wrap font-medium text-gray-800">
                  {verseData.content}
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
