import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './providers';

/**
 * Declares only the weights the stylesheet asks for: every `font-weight: 500`
 * in globals.css is on an Outfit element (.te, .btn, .label, .seg), so the
 * serif is only ever 400 or 600, and nothing uses Outfit 300.
 *
 * Note this is documentation, not a saving — Google serves both families as
 * variable fonts, so one file per family/style carries the whole weight axis
 * regardless of what is listed here. Three files, 107KB, whether this says
 * two weights or five. The only real lever left would be dropping the italic
 * Playfair file (31KB), and italic accents are core to the brand.
 */
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600'],
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
