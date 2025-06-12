import { useContext, useEffect, useMemo, useRef } from "react";
import { FilaContext } from "../context/fila-context";
import { StatusEnum } from "@/lib/enums/status-enum";
import { HubConnection } from "@microsoft/signalr";
import { connectToHub } from "@/lib/signalr/client";
import { eventosHubMonitor } from "@/constantes/eventos-hub-monitor";
import { toast } from "sonner";
import { useFila } from "./use-fila";

export function useSignalrFila() {
  // const { handleEventoChamarClientes } = useFila();
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    async function startConnection() {
      try {
        const connection = await connectToHub();
        connectionRef.current = connection;

        // connection.on(eventosHubMonitor.ChamarClientes, async (data) => {
        //   await handleEventoChamarClientes(data);
        // });

        connection.onclose(() => {
          toast.error("Erro de conexão.");
        });
        connection.onreconnecting(() => {
          toast.warning("Tentando se reconectar...");
        });
        connection.onreconnected(() => {
          toast.success("Reconectado com sucesso!");
        });

        await connection.start();
        console.log("Conexão iniciada com sucesso!");
      } catch (error) {
        toast.error("Erro ao iniciar conexão.");
      }
    }

    startConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, []);
}
