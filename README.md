# ChoristerCorner - React App

A comprehensive platform for choristers and worship leaders to discover, learn, and share beautiful worship songs.

Visit the original: https://choristercorner.com/

## Overview

ChoristerCorner is a modern, responsive React/Next.js application featuring:

- **Song Library**: Browse and search 48 worship songs
- **Hymn Collection**: Explore 25+ traditional hymns by category
- **Metronome**: Professional practice tool (40-300 BPM) with time signatures
- **Drum Machine**: Interactive drum patterns for worship practice
- **Contact Form**: EmailJS-integrated inquiry system
- **User Authentication**: Firebase-ready authentication

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with Header & Footer
│   ├── page.tsx             # Home page
│   ├── songs/page.tsx       # Songs library
│   ├── hymns/page.tsx       # Hymns collection
│   ├── metronome/page.tsx   # Metronome tool
│   ├── drummer/page.tsx     # Drum machine
│   ├── about/page.tsx       # About page
│   ├── contact/page.tsx     # Contact form
│   └── extras/page.tsx      # Resources & tools
├── components/              # Reusable components
├── data/                    # JSON data files
├── types/                   # TypeScript interfaces
└── utils/                   # Firebase & EmailJS config
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Configuration

### Firebase (Authentication)

1. Create project at [firebase.google.com](https://firebase.google.com)
2. Get credentials from Project Settings
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_id
   ```
4. Uncomment Firebase code in `src/utils/firebase.ts`

### EmailJS (Contact Form)

1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Create service and email template
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_key
   ```
4. Uncomment EmailJS code in `src/utils/emailjs.ts`

## Key Features

### ✅ Implemented
- Responsive design (mobile, tablet, desktop)
- Modular component architecture
- Full TypeScript support
- Search & filter functionality
- Grid/list view toggle
- JSON-based content management
- Professional UI matching original design

### 🔄 Ready for Integration
- Firebase Authentication
- EmailJS contact form
- Web Audio API for Metronome/Drummer

## Component Documentation

### SongCard
```tsx
<SongCard song={song} variant="grid" />
```
- Props: `song: Song`, `variant?: 'grid' | 'list'`
- Features: Play button, share, copy metadata

### HymnCard
```tsx
<HymnCard hymn={hymn} variant="grid" />
```
- Props: `hymn: Hymn`, `variant?: 'grid' | 'list'`
- Features: Multiple action buttons for hymn management

### ContactForm
```tsx
<ContactForm onSubmit={handleSubmit} isLoading={false} />
```
- Props: `onSubmit?: (data) => Promise<void>`, `isLoading?: boolean`
- Features: Validation, success feedback, EmailJS ready

## Data Management

### Adding Songs
Edit `src/data/songs.json`:
```json
{
  "id": "unique_id",
  "title": "Song Title",
  "artist": "Artist Name",
  "duration": "X minutes Y seconds",
  "imageUrl": "url",
  "channel": "Channel",
  "youtubeUrl": "url",
  "featured": true
}
```

### Adding Hymns
Edit `src/data/hymns.json`:
```json
{
  "id": "unique_id",
  "title": "Hymn Title",
  "author": "Author",
  "lyrics": "lyrics...",
  "imageUrl": "url",
  "category": "Grace|Strength|Faith|etc",
  "featured": true
}
```

## Styling

Built with **Tailwind CSS**:
- Purple/Blue accent colors
- Mobile-first responsive design
- Dark mode framework in place
- Utility-first CSS approach

## Type Definitions

See `src/types/index.ts` for:
- `Song`
- `Hymn`
- `ContactFormData`
- `MetronomeSettings`
- `DrumPattern`

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```bash
docker build -t choristercorner .
docker run -p 3000:3000 choristercorner
```

### Static Build
```bash
npm run build
npm run start
```

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Future Enhancements

- [ ] YouTube video embedding
- [ ] Audio playback with Web Audio API
- [ ] User profiles & authentication
- [ ] Favorite management
- [ ] Social sharing
- [ ] Mobile app
- [ ] Database backend
- [ ] Community collaboration

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS, Android)

## License

MIT License - Open to modification and use

## Questions?

Use the in-app Contact form or check the About page for more information.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
