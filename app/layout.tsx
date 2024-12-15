import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import NextTopLoader from "nextjs-toploader";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "E-SORR",
  description:
    "A Web Application for Re-accreditation of Recognized Student Organizations in the University of Santo Tomas",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(options);
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <NextTopLoader color="#FEC00F" height={8} />
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
