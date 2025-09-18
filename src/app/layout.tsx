import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Products App - E-commerce',
  description: 'Browse and discover amazing products with advanced filtering and search capabilities',
  keywords: ['products', 'e-commerce', 'shopping', 'filters', 'search'],
  authors: [{ name: 'Ali Bashirov' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NuqsAdapter>
          <div className="min-h-screen bg-background">
            <header className="border-b">
              <div className="container mx-auto px-4 py-4">
                <h1 className="text-2xl font-bold text-primary">
                  <Image src="/logo/logo.png" alt="Logo" width={120} height={30} />
                </h1>
              </div>
            </header>
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </NuqsAdapter>
      </body>
    </html>
  );
}