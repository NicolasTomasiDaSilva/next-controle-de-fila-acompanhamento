import getTokensAction from "@/features/autenticacao/actions/cookies/get-tokens-action";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

export async function connectToHub({
  queryParams = {},
  withoutAccessToken = false,
}: {
  queryParams?: Record<string, string>;
  withoutAccessToken?: boolean;
} = {}): Promise<HubConnection> {
  const baseUrl = process.env.NEXT_PUBLIC_SIGNALR_BASE_URL;
  const hub = "controledefilahub";

  const query = new URLSearchParams(queryParams).toString();

  let url = `${baseUrl}/${hub}`;
  if (query) url += `?${query}`;

  if (!withoutAccessToken) {
    const { accessToken } = await getTokensAction();

    url += query
      ? `&access_token=${accessToken}`
      : `?access_token=${accessToken}`;
  }

  const connection = new HubConnectionBuilder()
    .withUrl(url)
    .withAutomaticReconnect([0, 2000, 5000])
    .build();

  return connection;
}
