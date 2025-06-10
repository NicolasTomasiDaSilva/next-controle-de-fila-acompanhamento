import { axiosInstance } from "@/lib/api/api";
import {
  AuthTokens,
  authTokensSchema,
} from "@/lib/features/autenticacao/models/auth-tokens";
import { tokensCookiesParams } from "@/lib/utils/tokens-cookies-params";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { accessToken, refreshToken } = body as AuthTokens;
  console.log("accessToken", accessToken, "refreshToken", refreshToken);
  console.log("accessToken", accessToken, "refreshToken", refreshToken);
  console.log("accessToken", accessToken, "refreshToken", refreshToken);
  console.log("accessToken", accessToken, "refreshToken", refreshToken);

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(
    "accessToken",
    accessToken,
    tokensCookiesParams as Partial<ResponseCookie>
  );
  cookieStore.set(
    "refreshToken",
    refreshToken,
    tokensCookiesParams as Partial<ResponseCookie>
  );
  return NextResponse.json({});
}
