import type { Metadata } from "next";
import { Geist } from "next/font/google";
// import { ThemeProvider } from "next-themes";
import "./globals.css";
import NavBar from "@/components/NavBar";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-screen flex flex-col bg-white">
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
        <NavBar />
          {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
