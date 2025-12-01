export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string; // e.g., "11 minutes 27 seconds"
  imageUrl: string;
  channel: string;
  youtubeUrl: string;
  lyrics?: string;
  featured: boolean;
}

export interface Hymn {
  id: string;
  title: string;
  author: string;
  lyrics: string;
  imageUrl: string;
  category: string; // e.g., "Grace", "Strength", "Fellowship"
  featured: boolean;
}

export interface ContactFormData {
  contactType: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface MetronomeSettings {
  bpm: number;
  timeSignature: string;
  tempo: string; // e.g., "Allegro"
}

export interface DrumPattern {
  id: string;
  name: string;
  bpm: number;
  pattern: string[][];
  style: string;
}
