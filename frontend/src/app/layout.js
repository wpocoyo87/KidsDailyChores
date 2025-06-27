import { Gloria_Hallelujah } from "next/font/google";
import "./globals.css";

const gloriaHallelujah = Gloria_Hallelujah({ 
  subsets: ["latin"],
  weight: "400"
});

export const metadata = {
  title: "Kids Daily Chores",
  description: "A fun and safe app for kids to manage their daily chores",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={gloriaHallelujah.className}>{children}</body>
    </html>
  );
}
