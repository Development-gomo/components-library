import "./globals.css";
import { Instrument_Sans, Merriweather } from "next/font/google";
import Script from "next/script";

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

// ─── GTM ────────────────────────────────────────────────────────────────────
// Replace GTM-XXXXXXX with your container ID.
// Set to null to disable.
const GTM_ID = null; // e.g. "GTM-XXXXXXX"

// ─── CookieBot ──────────────────────────────────────────────────────────────
// Replace with your CookieBot domain group ID (cbid).
// Set to null to disable.
const COOKIEBOT_ID = null; // e.g. "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

// ─── JSON-LD / Schema ────────────────────────────────────────────────────────
// Add one object per schema type. Remove the array to disable.
const schemas = [
  // {
  //   "@context": "https://schema.org",
  //   "@type": "Organization",
  //   name: "Your Company",
  //   url: "https://yoursite.com",
  // },
];

// Lets relative URLs in metadata (e.g. proxied OG images from /api/media/...)
// resolve to absolute URLs automatically.
const siteUrl = process.env.SITE_URL;

export const metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: "Components Library",
  description: "Headless WordPress + Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ── CookieBot ── */}
        {COOKIEBOT_ID && (
          <Script
            id="cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={COOKIEBOT_ID}
            data-blockingmode="auto"
            strategy="beforeInteractive"
          />
        )}

        {/* ── GTM (head snippet) ── */}
        {GTM_ID && (
          <Script
            id="gtm-head"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}

        {/* ── JSON-LD schemas ── */}
        {schemas.map((schema, i) => (
          <Script
            key={`schema-${i}`}
            id={`schema-${i}`}
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>

      <body className={`${merriweather.variable} ${instrumentSans.variable}`}>
        {/* ── GTM (noscript fallback) ── */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        {children}
      </body>
    </html>
  );
}
