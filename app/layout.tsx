import type { Metadata, Viewport } from 'next';

const APP_URL = 'https://base-frame-plum.vercel.app';

const miniAppEmbed = {
  version: '1',
  imageUrl: `${APP_URL}/preview.png`,
  button: {
    title: 'Mint your Base role',
    action: {
      type: 'launch_frame',
      name: 'Base Roles',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: '#020b20',
    },
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: 'Base Roles',
  description:
    'Mint one of four onchain identities on Base: Builder, Creator, Farmer, or Basehead.',
  openGraph: {
    title: 'Base Roles',
    description: 'Discover and mint your onchain identity on Base.',
    images: ['/og.png'],
  },
  other: {
    'fc:miniapp': JSON.stringify(miniAppEmbed),
    'fc:frame': JSON.stringify(miniAppEmbed),
  },
};

export const viewport: Viewport = {
  themeColor: '#020b20',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#020b20' }}>{children}</body>
    </html>
  );
}
