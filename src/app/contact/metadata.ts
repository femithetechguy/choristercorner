import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact ChoristerCorner | Get in Touch',
  description:
    'Have questions or suggestions? Contact ChoristerCorner to share feedback, report issues, or get in touch with our team.',
  keywords: ['contact', 'support', 'feedback', 'get in touch'],
  openGraph: {
    title: 'Contact ChoristerCorner',
    description: 'Get in touch with our team or share your feedback.',
    type: 'website',
    url: 'https://choristercorner.com/contact',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact ChoristerCorner',
      },
    ],
  },
  alternates: {
    canonical: 'https://choristercorner.com/contact',
  },
};
