import "./globals.css";

export const metadata = {
  title: "Kids Daily Chores",
  description: "A fun and engaging daily chores app for kids",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Comic Sans MS" }}>{children}</body>
    </html>
  );
}
