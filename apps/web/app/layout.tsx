import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: "SHRTNR!",
  description: "Generate short urls with ease!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
