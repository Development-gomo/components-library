import "./globals.css";
import { Instrument_Sans, Merriweather } from "next/font/google";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata = {
  title: "Components Library",
  description: "Headless WordPress + Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${merriweather.variable} ${instrumentSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
