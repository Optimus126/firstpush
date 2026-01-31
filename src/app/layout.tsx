import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FirstPush — One Goal. Get the First Push You Need.",
  description: "Stop overthinking. Start doing. Pick ONE goal and we'll give you the first push to actually start.",
  keywords: "goals, productivity, habits, motivation, first step, accountability",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-900 text-white">
        {children}
      </body>
    </html>
  );
}
