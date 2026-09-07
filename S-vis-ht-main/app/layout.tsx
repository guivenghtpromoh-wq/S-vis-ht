import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { AppProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'SÈVIS HT — Jwenn moun ki ka fè travay la',
  description: 'Mache sèvis lokal an Ayiti pou jwenn pwofesyonèl serye ak kalifye fasilman.',
  openGraph: {
    title: 'SÈVIS HT — Jwenn moun ki ka fè travay la',
    description: 'Mache sèvis lokal an Ayiti pou jwenn pwofesyonèl serye ak kalifye fasilman.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SÈVIS HT — Jwenn moun ki ka fè travay la',
    description: 'Mache sèvis lokal an Ayiti pou jwenn pwofesyonèl serye ak kalifye fasilman.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ht">
      <body suppressHydrationWarning className="bg-[#F0F2F1] text-[#17231C] antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
