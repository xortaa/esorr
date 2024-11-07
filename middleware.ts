import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
  console.log("Middleware executed");

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;
  console.log("Pathname:", pathname);
  console.log("Token:", token);

  // Block access to the whole website if the user is not authenticated
  if (!token && pathname !== "/") {
    console.log("No token, redirecting to home");
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname === "/login-redirect") {
    if (token) {
      console.log("Token Role:", token.role);
      if (token.role === "OSA") {
        return NextResponse.redirect(new URL("/osa/manage-accounts", req.url));
      } else if (token.role === "RSO") {
        if (!token.isSetup) {
          return NextResponse.redirect(new URL("/rso-setup", req.url));
        }
        return NextResponse.redirect(new URL(`/organizations/${token._id}`, req.url));
      } else if (token.role === "SOCC") {
        if (!token.isSetup) {
          return NextResponse.redirect(new URL("/socc-setup", req.url));
        }
        return NextResponse.redirect(new URL("/organizations", req.url));
      } else if (token.role === "AU") {
        if (!token.isSetup) {
          return NextResponse.redirect(new URL("/au-setup", req.url));
        }
        return NextResponse.redirect(new URL("/organizations", req.url));
      } else if (token.role === "RSO-SIGNATORY") {
        if (!token.isSetup) {
          return NextResponse.redirect(new URL("/rso-signatory-setup", req.url));
        }
        return NextResponse.redirect(new URL("/organizations", req.url));
      } else if (token.role === "SOCC-SIGNATORY") {
        if (!token.isSetup) {
          return NextResponse.redirect(new URL("/socc-signatory-setup", req.url));
        }
        return NextResponse.redirect(new URL("/organizations", req.url));
      } else {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  console.log("Next response");
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login-redirect"],
};
