/**
 * Convert lyrics tags to uppercase for better readability during live performance
 * Examples: "Verse 1:" → "VERSE 1:", "Chorus:" → "CHORUS:", "Bridge:" → "BRIDGE:"
 */
export function formatLyricsTags(lyrics: string[]): string[] {
  return lyrics.map(lyric => {
    // Match patterns like "Verse 1:", "Chorus:", "Bridge:", "Pre-chorus:", "Refrain:", "Outro:", etc.
    // and convert them to uppercase
    return lyric.replace(
      /^(verse|chorus|bridge|pre-chorus|refrain|outro|intro|interlude)(\s+\d+)?:/gi,
      (match) => match.toUpperCase()
    );
  });
}

/**
 * Parse lyrics and return JSX-renderable parts with tag styling
 * Returns array of objects with text and styling info
 */
export function parseLyricsWithTags(lyrics: string[]) {
  return lyrics.map(lyric => {
    const tagMatch = lyric.match(/^(VERSE|CHORUS|BRIDGE|PRE-CHORUS|REFRAIN|OUTRO|INTRO|INTERLUDE)(\s+\d+)?:/i);
    
    if (tagMatch) {
      return {
        isTag: true,
        tag: tagMatch[0],
        content: lyric.replace(/^(VERSE|CHORUS|BRIDGE|PRE-CHORUS|REFRAIN|OUTRO|INTRO|INTERLUDE)(\s+\d+)?:\s*/i, '').trim(),
      };
    }
    
    return {
      isTag: false,
      tag: null,
      content: lyric,
    };
  });
}

/**
 * Parse lyrics to extract section tags
 */
export function extractLyricsSections(lyrics: string[]) {
  const sections: { type: string; index: number }[] = [];
  
  lyrics.forEach((lyric, index) => {
    const match = lyric.match(/^(VERSE|CHORUS|BRIDGE|PRE-CHORUS|REFRAIN|OUTRO|INTRO|INTERLUDE)(\s+\d+)?:/i);
    if (match) {
      sections.push({
        type: match[0],
        index,
      });
    }
  });
  
  return sections;
}
