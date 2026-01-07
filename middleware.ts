import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "Middleware Error: Missing Supabase environment variables. Please check your .env.local file."
    );
    return supabaseResponse;
  }

  let supabase;

  try {
    supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );
  } catch (error) {
    console.error("Middleware Error: Failed to create Supabase client:", error);
    // Continue without auth if client creation fails (likely due to invalid env vars)
    return supabaseResponse;
  }

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not signed in and trying to access protected route
  // Allow access to "/", "/login", "/auth", "/api", and public pages
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.startsWith("/about") &&
    !request.nextUrl.pathname.startsWith("/docs") &&
    !request.nextUrl.pathname.startsWith("/pricing") &&
    !request.nextUrl.pathname.startsWith("/changelog") &&
    !request.nextUrl.pathname.startsWith("/privacy") &&
    !request.nextUrl.pathname.startsWith("/terms") &&
    request.nextUrl.pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is signed in and trying to access login page
  if (user && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
