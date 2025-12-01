export interface Song {
  serial_number: number;
  title: string;
  channel: string;
  duration: string; // e.g., "11 minutes 27 seconds"
  url: string;
  lyrics?: string[];
}

export interface Hymn {
  serial_number: number;
  title: string;
  author: string;
  meter: string;
  category: string;
  year: number;
  channel: string;
  duration: string;
  url: string;
  lyrics?: string[];
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
