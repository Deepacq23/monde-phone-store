import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { isAllowedAdminEmail } from "@/lib/admin/auth";

const LOGIN_PATH = "/admin/login";
const NOT_AUTHORIZED_PATH = "/admin/not-authorized";

export async function middleware(request: NextRequest) {
  // Admin can't function without a database — let the pages themselves
  // explain that, rather than crashing the whole /admin segment here.
  if (!hasSupabaseEnv()) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === LOGIN_PATH;
  const isNotAuthorizedPage = pathname === NOT_AUTHORIZED_PATH;

  if (!user) {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }
    return response;
  }

  if (!isAllowedAdminEmail(user.email)) {
    if (!isNotAuthorizedPage) {
      return NextResponse.redirect(new URL(NOT_AUTHORIZED_PATH, request.url));
    }
    return response;
  }

  if (isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
