import getTokensAction from "@/features/autenticacao/actions/cookies/get-tokens-action";
import { NextResponse } from "next/server";

export async function GET() {
  const { accessToken } = await getTokensAction();

  return NextResponse.json({
    accessToken,
  });
}
