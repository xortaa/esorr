import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";
/*
export async function middleware(req: NextRequest) {
  console.log("Middleware executed");

  const { pathname } = req.nextUrl;
  console.log("Pathname:", pathname);

  // Allow access to public resources
  if (pathname.startsWith("/public/") || pathname.startsWith("/_next/") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Token:", token);

  // Handle unauthenticated users
  if (!token) {
    console.log("No token, redirecting to home");
    // Allow access to the home page, redirect others to home
    return pathname === "/" ? NextResponse.next() : NextResponse.redirect(new URL("/", req.url));
  }

  // From this point on, we know we have a token
  console.log("Token Role:", token.role);

  // Define allowed pages for each role
  const rolePages = {
    OSA: ["/osa/manage-accounts", "/osa/manage-affiliation", "/organizations", "/osa/manage-officer-in-charge"],
    RSO: ["/organizations", "/rso-setup"],
    SOCC: ["/organizations", "/socc-setup"],
    AU: ["/organizations", "/au-setup"],
   // "RSO-SIGNATORY": ["/organizations", "/rso-signatory-setup"],
   // "SOCC-SIGNATORY": ["/organizations", "/socc-signatory-setup"],
  };

  // Define setup pages for each role
  const setupPages = {
    RSO: "/rso-setup",
    SOCC: "/socc-setup",
    AU: "/au-setup",
    "RSO-SIGNATORY": "/rso-signatory-setup",
    "SOCC-SIGNATORY": "/socc-signatory-setup",
  };

  // Check if the user needs to complete setup
  if (token.role !== "OSA" && token.isSetup === false) {
    const setupPage = setupPages[token.role as keyof typeof setupPages];
    if (setupPage && !pathname.startsWith(setupPage)) {
      console.log(`${token.role} needs setup, redirecting to ${setupPage}`);
      return NextResponse.redirect(new URL(setupPage, req.url));
    }
  }

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
    } else {
      const setupPage = setupPages[token.role as keyof typeof setupPages];
      const redirectPage = token.isSetup ? "/organizations" : setupPage;
      return NextResponse.redirect(new URL(redirectPage, req.url));
    }
  }

  console.log("Next response");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public/).*)"],
};
*/