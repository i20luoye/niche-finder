import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Nav } from '@/components/nav';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Niche Finder · 利基探测器',
    template: '%s | Niche Finder',
  },
  description: 'AI 驱动的创业机会发现引擎，帮你找到小而美、获客快、盈利快的真实利基机会。',
  keywords: ['AI', '创业', '利基市场', 'Niche Finder', '商业机会', '市场调研'],
  authors: [{ name: 'Niche Finder' }],
  openGraph: {
    title: 'Niche Finder · 利基探测器',
    description: '90 秒内找到你下一个值得做的创业方向',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
