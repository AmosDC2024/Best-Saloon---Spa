import type { Metadata } from 'next';
import '../index.css';
import AppShell from '../components/AppShell';

export const metadata: Metadata = {
  title: 'Best Creative Hub — Akure | Salon, Signs & Craft, Fine Art',
  description:
    'Akure’s premier multi-disciplinary creative ecosystem uniting luxury grooming & spa wellness, high-impact 3D signage & craft fabrication, and bespoke fine art commissions.',
  keywords: [
    'Best Creative Hub',
    'Best Salon Akure',
    'Best Signs and Craft',
    'Best Art Studio',
    'Barber Shop Akure',
    'Signage Fabrication Ondo State',
    'Fine Art Commissions',
    'Barbering Academy Akure',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/arcade-america.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[#0A192F] text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
