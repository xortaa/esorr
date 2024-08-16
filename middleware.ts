import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard"],
};
