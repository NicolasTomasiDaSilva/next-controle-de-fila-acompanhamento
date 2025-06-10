import { axiosInstance } from "@/lib/api/api";
import { authTokensSchema } from "@/features/autenticacao/models/auth-tokens";
import { tokensCookiesParams } from "@/utils/tokens-cookies-params";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  return NextResponse.json({});
}
