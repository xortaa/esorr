import "./globals.css";
import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import { getServerSession } from "next-auth";
import Navbar from "@/components/Navbar";

const sourceSerif4 = Source_Serif_4({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-SORR",
  description:
    "A Web Application for Re-accreditation of Recognized Student Organizations in the University of Santo Tomas",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={sourceSerif4.className}>
          <Navbar />
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
