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

  if (token) {
    console.log("Token Role:", token.role);

    // Define allowed pages for each role
    const rolePages = {
      OSA: ["/osa/manage-accounts", "/osa/manage-affiliation", "/organizations"],
      RSO: ["/organizations", "/rso-setup"],
      SOCC: ["/organizations", "/socc-setup"],
      AU: ["/organizations", "/au-setup"],
      "RSO-SIGNATORY": ["/organizations", "/rso-signatory-setup"],
    };

    // Check if the user is trying to access a page not allowed for their role
    const allowedPages = rolePages[token.role as keyof typeof rolePages] || [];
    if (!allowedPages.some((page) => pathname.startsWith(page))) {
      console.log(`${token.role} accessing unauthorized page, redirecting`);

      // Redirect to the first allowed page for the role
      return NextResponse.redirect(new URL(allowedPages[0] || "/", req.url));
    }

    if (pathname === "/login-redirect") {
      if (token.role === "OSA") {
        return NextResponse.redirect(new URL("/osa/manage-accounts", req.url));
      } else if (token.role === "RSO") {
        return NextResponse.redirect(new URL(token.isSetup ? "/organizations" : "/rso-setup", req.url));
      } else if (token.role === "SOCC") {
        return NextResponse.redirect(new URL(token.isSetup ? "/organizations" : "/socc-setup", req.url));
      } else if (token.role === "AU") {
        return NextResponse.redirect(new URL(token.isSetup ? "/organizations" : "/au-setup", req.url));
      } else if (token.role === "RSO-SIGNATORY") {
        return NextResponse.redirect(new URL(token.isSetup ? "/organizations" : "/rso-signatory-setup", req.url));
      } else {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  console.log("Next response");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
