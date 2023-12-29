import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Strife",
  description: "Sow seeds of discord.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body className={font.className}>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem storageKey='strife-theme'>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
