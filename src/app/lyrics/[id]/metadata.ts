import { Metadata } from 'next';
import songs from '@/data/songs.json';
import hymns from '@/data/hymns.json';
import { extractSerialFromSlug } from '@/utils/slug';
import { Song, Hymn } from '@/types';

// Helper function to get YouTube thumbnail
function getYouTubeThumbnail(url: string): string {
  try {
    const videoId = new URL(url).searchParams.get('v') || url.split('v=')[1]?.split('&')[0] || '';
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  } catch {
    return '';
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // Parse slug to get serial number
  const songId = extractSerialFromSlug(id, songs as Song[], hymns as Hymn[]);
  
  if (!songId) {
    return {
      title: 'Song Not Found - ChoristerCorner',
      description: 'The song you are looking for could not be found.',
    };
  }

  // Find the song or hymn
  const song = (songs as Song[]).find((s: Song) => s.serial_number === songId);
  const hymn = !song ? (hymns as Hymn[]).find((h: Hymn) => h.serial_number === songId) : null;
  const item = song || hymn;

  if (!item) {
    return {
      title: 'Song Not Found - ChoristerCorner',
      description: 'The song you are looking for could not be found.',
    };
  }

  const thumbnail = getYouTubeThumbnail(item.url);
  const description = `Listen to "${item.title}" on ChoristerCorner. Music channel: ${item.channel}. Duration: ${item.duration}`;

  return {
    title: `${item.title} - ChoristerCorner`,
    description,
    openGraph: {
      title: item.title,
      description,
      type: 'music.song',
      url: `https://choristercorner.com/lyrics/${id}`,
      images: [
        {
          url: thumbnail,
          width: 1280,
          height: 720,
          alt: item.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description,
      images: [thumbnail],
    },
  };
}
