import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import ReduxProvider from "../redux/ReduxProvider";

export const metadata: Metadata = {
  title: "PT Fismed Global Indonesia",
  description: "Generate By PT Gunung Elang Indah",
  icons: {
    icon: '/LOGO.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-inter">
        <Providers>
          <ReduxProvider>{children}</ReduxProvider>
        </Providers>
      </body>
    </html>
  );
}
