import { Playfair_Display, Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hello Liar — Anonymous Interactive Platform",
  description: "Write your lies. Let the world doubt them.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;

  if (!['id', 'en'].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-serif bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <Navigation />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <footer 
            className="border-t py-8 md:py-12 px-6 md:px-12"
            style={{ borderColor: 'var(--gray-100)' }}
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <span 
                className="text-[10px] font-sans uppercase tracking-[0.3em]"
                style={{ color: 'var(--gray-400)' }}
              >
                Hello Liar © {new Date().getFullYear()}
              </span>
              <span 
                className="text-[10px] font-sans uppercase tracking-[0.2em]"
                style={{ color: 'var(--gray-300)' }}
              >
                {locale === 'en' ? 'Everyone lies.' : 'Semua orang berbohong.'}
              </span>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
