import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

export async function connectToHub(
  nomeHub: string,
  queryParams?: Record<string, string>
): Promise<HubConnection> {
  const query = new URLSearchParams(queryParams).toString();
  const url = `${process.env.NEXT_PUBLIC_SIGNALR_BASE_URL}/${nomeHub}${
    query ? `?${query}` : ""
  }`;

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
