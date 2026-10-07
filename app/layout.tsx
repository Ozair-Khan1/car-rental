import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Anton } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const fontDisplay = Anton({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "DriveNow | Car Rental",
  description:
    "Premium vehicles, flexible rentals, and a smarter way to get where you're going.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=t==='dark'||(!t&&d);var el=document.documentElement;if(dark){el.setAttribute('data-theme','dark');el.classList.add('dark');}else{el.setAttribute('data-theme','light');el.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} font-sans antialiased min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Global Cream Grid Background across entire page and footer */}
            <div className="fixed inset-0 pointer-events-none z-0 animate-grid bg-[linear-gradient(to_right,var(--grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <Toaster position="top-center" richColors />
            <Navbar />
            <main className="flex-1 relative z-10">{children}</main>
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
