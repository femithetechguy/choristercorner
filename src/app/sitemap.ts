import { MetadataRoute } from 'next';
import songs from '@/data/songs.json';
import hymns from '@/data/hymns.json';
import { createSlug } from '@/utils/slug';
import { Song, Hymn } from '@/types';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://choristercorner.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/songs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hymns`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Song pages
  const songPages: MetadataRoute.Sitemap = (songs as Song[]).map((song) => ({
    url: `${baseUrl}/lyrics/${createSlug(song.title, song.serial_number, 'song')}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Hymn pages
  const hymnPages: MetadataRoute.Sitemap = (hymns as Hymn[]).map((hymn) => ({
    url: `${baseUrl}/lyrics/${createSlug(hymn.title, hymn.serial_number, 'hymn')}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...songPages, ...hymnPages];
}
