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
    const res = await fetch("/api/get-access-token");
    const { accessToken } = await res.json();

    url += query
      ? `&access_token=${accessToken}`
      : `?access_token=${accessToken}`;
  }

  const connection = new HubConnectionBuilder()
    .withUrl(url)
    .withAutomaticReconnect()
    .build();

  // Loga caso a conexão caia
  connection.onclose((error) => {
    console.log("🔴 SignalR desconectado.", error);
  });

  // Loga tentativa de reconexão
  connection.onreconnecting((error) => {
    console.log("🟡 Tentando reconectar ao SignalR...", error);
  });

  // Loga quando reconecta com sucesso
  connection.onreconnected((connectionId) => {
    console.log("🟢 Reconectado ao SignalR com ID:", connectionId);
  });

  return connection;
}
