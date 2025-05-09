import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  // Paths that don't require authentication
  const publicPaths = ["/", "/login", "/admin/login", "/directory", "/feasts"]
  const isPublicPath = publicPaths.some((path) => new RegExp(`^${path}(/.*)?$`).test(request.nextUrl.pathname))
  // Admin-only paths
  const adminPaths = ["/admin/dashboard"]
  const isAdminPath = adminPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Church-only paths
  const churchPaths = ["/dashboard"]
  const isChurchPath = churchPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // If the path is public and the user is not logged in, allow access
  if (isPublicPath && !token) {
    return NextResponse.next()
  }

  try {
    // If there's no token and the path requires authentication, redirect to login
    if (!token) {
      if (isAdminPath) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const { payload } = await jwtVerify(token, secret)

    // Check if the user has the correct role for the path
    if (isAdminPath && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (isChurchPath && payload.role !== "CHURCH") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // If the user is logged in and trying to access a public path, redirect to the appropriate dashboard
    // if (isPublicPath && token) {
    //   if (payload.role === "ADMIN") {
    //     return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    //   }
    //   return NextResponse.redirect(new URL("/dashboard", request.url))
    // }

    return NextResponse.next()
  } catch (error) {
    // If the token is invalid, clear it and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    })
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
