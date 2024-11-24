import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
  console.log("Middleware executed");

  const { pathname } = req.nextUrl;
  console.log("Pathname:", pathname);

  // Allow access to public resources
  if (
    pathname.startsWith("/public/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".") ||
    pathname === "/test"
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Middleware Token:", token);

  // Handle unauthenticated users
  if (!token) {
    console.log("No token, redirecting to home");
    return pathname === "/" ? NextResponse.next() : NextResponse.redirect(new URL("/", req.url));
  }

  console.log("Token Role:", token.role);
  console.log("Token isSetup:", token.isSetup);
  console.log("Token Organization:", token.organization);

  // Define allowed pages for each role
  const rolePages = {
    OSA: ["/osa", "/organizations"],
    RSO: [`/organizations/${token.organization}`, "/rso-setup"],
    SOCC: ["/organizations"],
    AU: ["/organizations"],
  };

  // Define setup pages for each role
  const setupPages = {
    RSO: "/rso-setup",
  };

  // Handle RSO specific redirection
  if (token.role === "RSO" && token.isSetup && token.organization) {
    if (pathname === "/organizations" || pathname === "/login-redirect") {
      console.log("RSO user redirected to specific organization page");
      return NextResponse.redirect(new URL(`/organizations/${token.organization}`, req.url));
    }
    if (!pathname.startsWith(`/organizations/${token.organization}`)) {
      console.log("RSO user accessing unauthorized page, redirecting");
      return NextResponse.redirect(new URL(`/organizations/${token.organization}`, req.url));
    }
  }

  // Check if the user is trying to access a page not allowed for their role
  const allowedPages = rolePages[token.role as keyof typeof rolePages] || [];
  if (!allowedPages.some((page) => pathname.startsWith(page))) {
    console.log(`${token.role} accessing unauthorized page, redirecting`);
    // Redirect to the first allowed page for the role
    return NextResponse.redirect(new URL(allowedPages[0] || "/", req.url));
  }

  // Check if the user needs to complete setup (only for roles with setup pages)
  if (token.isSetup === false && setupPages[token.role as keyof typeof setupPages]) {
    console.log(`${token.role} user not set up, redirecting to setup page`);
    return NextResponse.redirect(new URL(setupPages[token.role as keyof typeof setupPages], req.url));
  }

  if (pathname === "/login-redirect") {
    if (token.role === "AU" || token.role === "SOCC" || token.isSetup) {
      console.log("User is set up or AU/SOCC, redirecting to appropriate page");
      return NextResponse.redirect(new URL(allowedPages[0], req.url));
    } else {
      console.log(`${token.role} user is not set up, redirecting to setup page`);
      return NextResponse.redirect(new URL(setupPages[token.role as keyof typeof setupPages] || "/", req.url));
    }
  }

  // Block RSO access to general /api/organizations
  if (token.role === "RSO" && pathname === "/api/organizations") {
    console.log("RSO attempting to access /api/organizations, blocked");
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  console.log("Next response");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public/).*)"],
};
