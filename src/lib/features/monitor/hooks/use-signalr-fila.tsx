import { useContext, useEffect, useMemo } from "react";
import { FilaContext } from "../context/fila-context";
import { StatusEnum } from "@/lib/enums/status-enum";
import { HubConnection } from "@microsoft/signalr";
import { connectToHub } from "@/lib/signalr/client";
import { eventosHubMonitor } from "@/constantes/eventos-hub-monitor";
import { toast } from "sonner";
import { useFila } from "./use-fila";

export function useSignalrFila() {
  // const { handleEventoChamarClientes } = useFila();
  useEffect(() => {
    let connection: HubConnection;
    let isMounted = true;

    async function startConnection() {
      try {
        if (!isMounted) {
          return;
        }
        connection = await connectToHub();

        connection.on(eventosHubMonitor.ChamarClientes, async (data) => {
          // await handleEventoChamarClientes(data);
        });

        // Loga caso a conexão caia
        connection.onclose(() => {
          toast.error("Erro de conexão.");
        });

        // Loga tentativa de reconexão
        connection.onreconnecting(() => {
          toast.warning("Tentando se reconectar...");
        });

        // Loga quando reconecta com sucesso
        connection.onreconnected(() => {
          toast.success("Reconectado com sucesso!");
        });

        await connection.start();
        toast.success("Conectado com sucesso!");
      } catch (error) {
        toast.error("Erro ao iniciar conexão.");
      }
    }

    startConnection();

    return () => {
      isMounted = false;
      if (connection) {
        connection.stop();
      }
    };
  }, []);
}
