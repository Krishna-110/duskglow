import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './providers';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  // Display type carries the brand — load the weights the design actually uses.
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://duskglow.site'),
  title: 'Duskglow — Direct Booking Sites for Villas & Short-Term Rentals',
  description:
    'Custom direct-booking microsites for luxury villa hosts — and any short-term rental. Turn Airbnb guests into repeat direct bookers with zero commissions, your own domain, and live calendar integration.',
  keywords: [
    'villa booking',
    'direct booking website',
    'luxury villa microsite',
    'short term rental website',
    'airbnb alternative',
    'vacation rental website',
  ],
  openGraph: {
    title: 'Duskglow — Own the moment. Own the guest.',
    description:
      'Direct-booking microsites for short-term rental hosts. Eliminate 15.5% Airbnb commissions forever.',
    url: 'https://duskglow.site',
    siteName: 'Duskglow',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Duskglow — Own the moment. Own the guest.',
    description:
      'Direct-booking microsites for short-term rental hosts. Eliminate 15.5% Airbnb commissions forever.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ece6dd' },
    { media: '(prefers-color-scheme: dark)', color: '#17120e' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-canvas text-ink font-sans antialiased min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
