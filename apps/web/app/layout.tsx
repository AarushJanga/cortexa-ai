import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cortexa AI — Learn Smarter. Remember Longer. Achieve Further.",
  description:
    "Cortexa AI helps students understand complex content, prepare for exams, build skills, and get job-ready — all in one place.",
  keywords: ["AI study companion", "exam preparation", "resume analyzer", "flashcards", "quizzes", "RAG AI"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
