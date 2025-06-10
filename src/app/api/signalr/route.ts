import getTokensAction from "@/actions/cookies/get-tokens-action";
import { NextResponse } from "next/server";

export async function GET() {
  const { accessToken } = await getTokensAction();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const negotiateUrl = `${process.env.NEXT_PUBLIC_SIGNALR_BASE_URL}/controledefilahub?access_token=${accessToken}`;

  return NextResponse.json({
    url: negotiateUrl,
    accessToken,
  });
}
