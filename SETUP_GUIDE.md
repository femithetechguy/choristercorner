# ChoristerCorner - Setup & Integration Guide

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.local.example .env.local

# 3. Run dev server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Firebase Authentication Setup

### Prerequisites
- Google account
- Firebase project

### Steps

1. **Create Firebase Project**
   - Go to [console.firebase.google.com](https://console.firebase.google.com)
   - Click "Create Project"
   - Follow the setup wizard

2. **Get Your Credentials**
   - In Firebase Console, go to ⚙️ Settings > Project settings
   - Scroll to "Your apps" section
   - Find your web app config
   - Copy all values

3. **Add to Environment**
   - Open `.env.local`
   - Fill in these values:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Enable Authentication**
   - In Firebase Console: Authentication > Sign-in method
   - Enable "Email/Password"
   - (Optional) Enable Google, GitHub, etc.

5. **Activate in App**
   - Open `src/utils/firebase.ts`
   - Uncomment the initialization code:
   ```tsx
   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   ```

6. **Use in Your App**
   - Import auth: `import { auth } from '@/utils/firebase'`
   - Use functions from `firebase/auth`:
   ```tsx
   import { signInWithEmailAndPassword } from 'firebase/auth';
   
   const result = await signInWithEmailAndPassword(auth, email, password);
   ```

### Common Firebase Functions

```tsx
// Sign up
import { createUserWithEmailAndPassword } from 'firebase/auth';
await createUserWithEmailAndPassword(auth, email, password);

// Sign in
import { signInWithEmailAndPassword } from 'firebase/auth';
await signInWithEmailAndPassword(auth, email, password);

// Sign out
import { signOut } from 'firebase/auth';
await signOut(auth);

// Monitor auth state
import { onAuthStateChanged } from 'firebase/auth';
onAuthStateChanged(auth, (user) => {
  if (user) console.log('Logged in:', user.email);
});
```

---

## EmailJS Contact Form Setup

### Prerequisites
- Email account (Gmail, Outlook, etc.)
- EmailJS account

### Steps

1. **Create EmailJS Account**
   - Go to [emailjs.com](https://www.emailjs.com/)
   - Sign up (free tier available)

2. **Connect Email Service**
   - Dashboard > Email Services
   - Add new service (Gmail recommended)
   - Authorize access to your email
   - Copy Service ID

3. **Create Email Template**
   - Dashboard > Email Templates
   - Create new template
   - Use these template variables:
     ```
     From: {{from_name}} <{{from_email}}>
     Type: {{contact_type}}
     Subject: {{subject}}
     
     Message:
     {{message}}
     ```
   - Copy Template ID

4. **Get Public Key**
   - Dashboard > Account
   - Copy Public Key

5. **Add to Environment**
   - Open `.env.local`
   - Add:
   ```
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

6. **Activate in App**
   - Open `src/utils/emailjs.ts`
   - Uncomment the initialization code
   - Update the `sendEmail` function

7. **Use in Contact Form**
   - Open `src/app/contact/page.tsx`
   - Import `sendEmail` from `@/utils/emailjs`
   - Update `handleFormSubmit`:
   ```tsx
   const handleFormSubmit = async (data: ContactFormData) => {
     try {
       await sendEmail({
         to_email: 'contact@choristercorner.com',
         from_name: data.name,
         from_email: data.email,
         contact_type: data.contactType,
         subject: data.subject,
         message: data.message,
       });
     } catch (error) {
       console.error('Error:', error);
     }
   };
   ```

### Test Email Sending

```tsx
import { sendEmail } from '@/utils/emailjs';

const testEmail = async () => {
  await sendEmail({
    to_email: 'your@email.com',
    from_name: 'Test User',
    from_email: 'test@example.com',
    contact_type: 'General Contact',
    subject: 'Test Email',
    message: 'This is a test email',
  });
};
```

---

## File Structure Reference

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Header/Footer
│   ├── page.tsx                # Home page
│   ├── (routes)
│   │   ├── songs/page.tsx      # Songs library with search
│   │   ├── hymns/page.tsx      # Hymns collection
│   │   ├── metronome/page.tsx  # Metronome practice tool
│   │   ├── drummer/page.tsx    # Drum machine practice
│   │   ├── about/page.tsx      # About page
│   │   ├── contact/page.tsx    # Contact form (EmailJS)
│   │   └── extras/page.tsx     # External resources
│   └── globals.css             # Tailwind styles
│
├── components/                 # Reusable React components
│   ├── Header.tsx              # Navigation header
│   ├── Footer.tsx              # Footer with links
│   ├── SongCard.tsx            # Song display card
│   ├── HymnCard.tsx            # Hymn display card
│   ├── StatBox.tsx             # Statistics box
│   └── ContactForm.tsx         # Contact form (EmailJS ready)
│
├── data/                       # JSON data files
│   ├── songs.json              # 48 worship songs
│   └── hymns.json              # 25 traditional hymns
│
├── types/                      # TypeScript interfaces
│   └── index.ts                # All type definitions
│
└── utils/                      # Utility functions & config
    ├── firebase.ts             # Firebase config
    ├── firebaseSetup.md        # Firebase setup guide
    ├── emailjs.ts              # EmailJS config
    └── emailjsSetup.md         # EmailJS setup guide
```

---

## Customization Guide

### Change Colors

Edit `tailwind.config.ts` or update className colors:

```tsx
// Change from purple to blue
className="bg-purple-600" → className="bg-blue-600"
```

Current color scheme:
- Primary: Purple (#7C3AED)
- Secondary: Blue (#3B82F6)
- Accents: Various pastels

### Add More Songs/Hymns

Edit `src/data/songs.json` or `src/data/hymns.json`:

```json
{
  "id": "unique-id-5",
  "title": "Amazing Grace",
  "artist": "John Newton",
  "duration": "3 minutes 45 seconds",
  "imageUrl": "https://example.com/image.jpg",
  "channel": "Hymn Channel",
  "youtubeUrl": "https://youtube.com/watch?v=...",
  "featured": true
}
```

### Update Site Metadata

Edit `src/app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: 'Your App Title',
  description: 'Your app description',
};
```

### Deploy to Production

#### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

#### Self-Hosted (Node.js)
```bash
npm run build
npm run start
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Troubleshooting

### Firebase Not Connecting
- ✓ Check `.env.local` has correct values
- ✓ Verify credentials from Firebase Console
- ✓ Ensure Firebase config is initialized before use
- ✓ Check Network tab in browser DevTools

### EmailJS Not Sending
- ✓ Verify all credentials in `.env.local`
- ✓ Check email template variables match template
- ✓ Test in EmailJS dashboard first
- ✓ Check browser console for errors

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Port 3000 Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

---

## Next Steps

1. **Set up Firebase Authentication**
   - Create login/signup pages
   - Add user context/state management

2. **Integrate EmailJS**
   - Test contact form
   - Set up email templates

3. **Enhance Features**
   - Add YouTube video embedding
   - Implement Web Audio API for metronome
   - Add database for user data

4. **Deployment**
   - Deploy to Vercel or your hosting
   - Set up custom domain
   - Configure SSL certificate

---

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **EmailJS Docs**: https://www.emailjs.com/docs
- **React Docs**: https://react.dev

---

## Support

- Check the README.md for more info
- Review component documentation
- Check setup guides in `src/utils/`

Happy coding! 🎵
