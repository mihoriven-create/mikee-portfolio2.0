import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/content/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const title = `${profile.name} — ${profile.role}`;
const description =
  "Michael John Buencamino — CRM & Technical Operations Specialist. CRM administration, workflow automation, AI Voice and Conversation AI, API and webhook integrations, and backend operations for US-based businesses.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title,
  description,
  authors: [{ name: profile.name }],
  keywords: [
    "CRM Specialist",
    "GoHighLevel",
    "Workflow Automation",
    "Conversation AI",
    "AI Voice",
    "API Integrations",
    "Webhooks",
    "Technical Operations",
    "Zoho CRM",
    "Michael John Buencamino",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.name,
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#07080a",
  colorScheme: "dark",
};

// Runs before first paint: enables JS-only reveal states and skips the
// intro on repeat visits within a session.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('mjb-intro')){d.classList.add('intro-seen')}else{sessionStorage.setItem('mjb-intro','1')}}catch(e){}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.nickname,
  jobTitle: profile.role,
  url: profile.siteUrl,
  email: `mailto:${profile.email}`,
  image: `${profile.siteUrl}${profile.portrait.src}`,
  address: { "@type": "PostalAddress", addressLocality: "Iloilo", addressCountry: "PH" },
  worksFor: { "@type": "Organization", name: "American Financial Services, LLC" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Western Institute of Technology" },
  knowsAbout: [
    "GoHighLevel",
    "Zoho CRM",
    "Workflow automation",
    "Conversation AI",
    "API integrations",
    "Webhooks",
    "Google Apps Script",
    "Zapier",
    "Next.js",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
