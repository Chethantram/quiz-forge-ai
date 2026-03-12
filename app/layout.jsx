import {Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});



export const metadata = {
  title: "QuizForge AI — Generate Quizzes with AI",
  description: "Create intelligent quizzes instantly using AI. Upload your content and get a quiz in seconds.",
  keywords: "quiz generator, AI quiz, quiz maker, online quiz, generate quiz",
  metadataBase: new URL("https://quizforge.jo3.org"),
  openGraph: {
    title: "QuizForge AI — Generate Quizzes with AI",
    description: "Create intelligent quizzes instantly using AI.",
    url: "https://quizforge.jo3.org",
    siteName: "QuizForge AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuizForge AI",
    description: "Create intelligent quizzes instantly using AI.",
  },
  verification: {
    google: "qG9tvE6a3oRs2eBz-i3SQ_xsmfK-Z0y3soJ3XeuViHI",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div>
            <div className="md:px-10 px-4 bg-background dark:bg-[#00000D] text-gray-900 dark:text-gray-100">
              <Navbar />
                <div className="min-h-screen">{children}</div>
            </div>
            <div className="">
              <Footer />
            </div>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
