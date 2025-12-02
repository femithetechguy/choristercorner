/**
 * Convert a title to a URL-friendly slug
 * Example: "Blest Be The Tie That Binds" -> "blest-be-the-tie-that-binds"
 */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Parse a slug to determine if it's serial-based or title-based
 * Serial-based: song-42, hymn-5
 * Title-based: blest-be-the-tie-that-binds
 */
export function parseSlug(slug: string): {type: 'title' | 'serial'; title?: string; serial?: number; itemType?: 'song' | 'hymn'} | null {
  // Check if it's a serial-based slug (song-42 or hymn-5)
  const serialMatch = slug.match(/^(song|hymn)-(\d+)$/i);
  if (serialMatch) {
    return {
      type: 'serial',
      serial: parseInt(serialMatch[2], 10),
      itemType: serialMatch[1] as 'song' | 'hymn'
    };
  }
  
  // Otherwise it's a title-based slug
  return {
    type: 'title',
    title: slug
  };
}

/**
 * Extract serial number from slug by searching through songs and hymns
 * Handles both title-based slugs and serial-based slugs (song-42, hymn-5)
 * Also handles missing titles by using serial number fallback
 */
export function extractSerialFromSlug(slug: string, songs: any[], hymns: any[]): number | null {
  const parsed = parseSlug(slug);
  if (!parsed) return null;
  
  // If it's already a serial-based slug, return directly
  if (parsed.type === 'serial') {
    return parsed.serial!;
  }
  
  // Otherwise it's a title-based slug, search for matching title
  const titleSlug = parsed.title!;
  
  // Try to find a song with matching title slug
  const song = songs.find((s: any) => s.title && titleToSlug(s.title) === titleSlug);
  if (song) return song.serial_number;
  
  // Try to find a hymn with matching title slug
  const hymn = hymns.find((h: any) => h.title && titleToSlug(h.title) === titleSlug);
  if (hymn) return hymn.serial_number;
  
  return null;
}

/**
 * Create a slug from title or serial number as fallback
 * For hymns: Always uses serial-based slug to avoid conflicts (hymn-5)
 * For songs: Uses title-based slug if available, serial-based as fallback
 * Example: "Blest Be The Tie That Binds" hymn -> "hymn-2"
 * Example: "Song Title" song -> "song-title"
 * Fallback: song-42, hymn-5
 */
export function createSlug(title: string, serial?: number, type?: 'song' | 'hymn'): string {
  // For hymns, always use serial-based slug to avoid conflicts with songs
  if (type === 'hymn' && serial !== undefined) {
    return `hymn-${serial}`;
  }
  
  if (!title || title.trim().length === 0) {
    if (serial !== undefined && type) {
      return `${type}-${serial}`;
    }
    return '';
  }
  return titleToSlug(title);
}
