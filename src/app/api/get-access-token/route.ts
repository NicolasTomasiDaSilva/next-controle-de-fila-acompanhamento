import getTokensAction from "@/actions/cookies/get-tokens-action";
import { NextResponse } from "next/server";

export async function GET() {
  const { accessToken } = await getTokensAction();

  return NextResponse.json({
    accessToken,
  });
}
