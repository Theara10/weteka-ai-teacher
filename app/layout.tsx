import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Weteka AI ជំនួយការ - ជំនួយការអប់រំ និងកិច្ចការរដ្ឋបាលសម្រាប់កម្ពុជា",
    template: "%s | Weteka AI ជំនួយការ"
  },
  description: "ជំនួយការអប់រំ និងកិច្ចការរដ្ឋបាលដ៏ទូលំទូលាយសម្រាប់កម្ពុជា។ សួរសំណួរណាមួយ អំពីគណិតវិទ្យា សិល្បៈ កម្មវិធី ឯកសារ និងច្រើនទៀត។",
  keywords: [
    "Weteka AI", "កម្ពុជា", "អប់រំ", "ជំនួយការ", "AI", "ភាសាខ្មែរ", 
    "គណិតវិទ្យា", "សិល្បៈ", "កម្មវិធី", "ឯកសារ", "Cambodia", "education", 
    "Khmer", "assistant", "រដ្ឋបាល", "administrative"
  ],
  authors: [{ name: "Weteka AI Team" }],
  creator: "Weteka AI",
  publisher: "Weteka AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'km_KH',
    alternateLocale: 'en_US',
    title: "Weteka AI ជំនួយការ - ជំនួយការអប់រំសម្រាប់កម្ពុជា",
    description: "ជំនួយការអប់រំ និងកិច្ចការរដ្ឋបាលដ៏ទូលំទូលាយសម្រាប់កម្ពុជា។ សួរសំណួរណាមួយ អំពីគណិតវិទ្យា សិល្បៈ កម្មវិធី ឯកសារ និងច្រើនទៀត។",
    siteName: "Weteka AI",
    images: [
      {
        url: '/weteka-logo.png',
        width: 1200,
        height: 630,
        alt: 'Weteka AI ជំនួយការ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Weteka AI ជំនួយការ",
    description: "ជំនួយការអប់រំ និងកិច្ចការរដ្ឋបាលដ៏ទូលំទូលាយសម្រាប់កម្ពុជា",
    images: ['/weteka-logo.png'],
  },
  icons: {
    icon: [
      { url: '/weteka-logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/weteka-logo.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/weteka-logo.png',
    apple: [
      { url: '/weteka-logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  other: {
    'google-site-verification': '', // Add your verification code here
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="km">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Set theme color dynamically based on user preference
            (function() {
              function updateThemeColor() {
                const isDark = document.documentElement.classList.contains('dark');
                const metaThemeColor = document.querySelector('meta[name="theme-color"]');
                if (metaThemeColor) {
                  metaThemeColor.setAttribute('content', isDark ? '#0f172a' : '#2563eb');
                }
              }
              
              // Update on load
              updateThemeColor();
              
              // Watch for theme changes
              const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                  if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    updateThemeColor();
                  }
                });
              });
              
              observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class']
              });
            })();
          `
        }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
