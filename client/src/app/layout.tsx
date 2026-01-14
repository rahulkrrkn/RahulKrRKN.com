import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rahul Kr | Software Engineer (Full Stack & AI/ML)",
    template: "%s | RahulKrRKN",
  },
  description:
    "Rahul Kr (RahulKrRKN) is a Software Engineer skilled in Full Stack Web Development (MERN), Java & DSA, and currently learning AI/ML with Python. Explore projects, skills, and experience.",
  keywords: [
    "Rahul Kr",
    "RahulKrRKN",
    "Software Engineer",
    "Full Stack Developer",
    "MERN Stack",
    "AI ML",
    "Machine Learning with Python",
    "Java DSA",
    "Developer Portfolio",
  ],
  authors: [{ name: "Rahul Kr" }],
  creator: "Rahul Kr",
  metadataBase: new URL("https://rahulkrkn.com"),
  openGraph: {
    title: "Rahul Kr | Software Engineer (Full Stack & AI/ML)",
    description:
      "Portfolio of Rahul Kr – Software Engineer working with MERN stack, Java, DSA, and learning AI/ML using Python.",
    url: "https://rahulkrkn.com",
    siteName: "RahulKrRKN",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z9WTE21G0Y"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z9WTE21G0Y');
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
