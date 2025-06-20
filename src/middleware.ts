import { NextURL } from "next/dist/server/web/next-url";
import { MiddlewareConfig, NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { cookies } from "next/headers";

import { refreshToken } from "./lib/axios/axios";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { jwtIsValid } from "./lib/utils/jwt-utils";

import { tokensCookiesParams } from "./lib/utils/jwt-utils";
import { UnauthenticatedError } from "./lib/errors/errors";
import { AuthTokens } from "./features/autenticacao/models/auth-tokens";

const publicRoutes = [
  { path: "/monitor/login", whenAuthenticated: "redirect" },
  { path: "/app-cliente/:hash", whenAuthenticated: "ignore" },
] as const;
const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/monitor/login";
const REDIRECT_WHEN_AUTHENTICATED_ROUTE = "/monitor";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  // 🚫 Ignora requisições internas do Next (server actions / RSC updates)
  const accept = req.headers.get("accept");
  if (req.method === "POST" && accept && accept.includes("text/x-component")) {
    return NextResponse.next();
  }
  try {
    const { pathname } = req.nextUrl;
    const publicRoute = isPublicRoute(pathname);
    const cookieStore = await cookies();
    const accessTokenStored = cookieStore.get("accessToken")?.value;
    const refreshTokenStored = cookieStore.get("refreshToken")?.value;

    if (!refreshTokenStored && !publicRoute) {
      const redirectUrl: NextURL = req.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
      return NextResponse.redirect(redirectUrl);
    }

    if (
      refreshTokenStored &&
      publicRoute &&
      publicRoute?.whenAuthenticated === "redirect"
    ) {
      const redirectUrl: NextURL = req.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_AUTHENTICATED_ROUTE;
      return NextResponse.redirect(redirectUrl);
    }

    if (publicRoute) {
      return NextResponse.next();
    }

    if (jwtIsValid(accessTokenStored) && jwtIsValid(refreshTokenStored)) {
      return NextResponse.next();
    }

    if (jwtIsValid(refreshTokenStored) && refreshTokenStored) {
      const response = NextResponse.next();

      const tokens: AuthTokens = (await refreshToken(
        refreshTokenStored
      )) as AuthTokens;
      response.cookies.set(
        "accessToken",
        tokens.accessToken,
        tokensCookiesParams as Partial<ResponseCookie>
      );
      response.cookies.set(
        "refreshToken",
        tokens.refreshToken,
        tokensCookiesParams as Partial<ResponseCookie>
      );
      return response;
    }
    throw new Error("Sem sessão");
  } catch (error: any) {
    if (error instanceof UnauthenticatedError) {
      const redirectUrl: NextURL = req.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    } else {
      throw error;
    }
  }
}

export const config: MiddlewareConfig = {
  //TODO: remover |__nextjs_original-stack-frames
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

function isPublicRoute(
  pathname: string
): (typeof publicRoutes)[number] | undefined {
  return publicRoutes.find((route) => {
    if (route.path.includes(":")) {
      const regexPath = new RegExp(
        "^" + route.path.replace(/:[^\/]+/g, "[^/]+") + "$"
      );
      return regexPath.test(pathname);
    }
    return route.path === pathname;
  });
}
