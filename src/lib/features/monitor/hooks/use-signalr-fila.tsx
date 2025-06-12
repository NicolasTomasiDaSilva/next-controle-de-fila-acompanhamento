import { useContext, useEffect, useMemo, useRef } from "react";
import { FilaContext } from "../context/fila-context";
import { StatusEnum } from "@/lib/enums/status-enum";
import { HubConnection } from "@microsoft/signalr";
import { connectToHub } from "@/lib/signalr/client";
import { eventosHubMonitor } from "@/constantes/eventos-hub-monitor";
import { toast } from "sonner";
import { useFila } from "./use-fila";
import {
  DataEventoAcaoClienteDTO,
  dataEventoAcaoClienteSchema,
} from "../models/data-evento-acao-admin";

interface useSignalrFilaProps {
  handleEventoChamarClientes: (data: DataEventoAcaoClienteDTO) => Promise<void>;
  handleEventoVoltarClientes: (data: DataEventoAcaoClienteDTO) => Promise<void>;
}
export function useSignalrFila({
  handleEventoChamarClientes,
  handleEventoVoltarClientes,
}: useSignalrFilaProps) {
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    async function startConnection() {
      try {
        const connection = await connectToHub();
        connectionRef.current = connection;

        connection.on(eventosHubMonitor.ChamarClientes, async (data) => {
          await handleEventoChamarClientes(data);
        });
        connection.on(
          eventosHubMonitor.VoltarParaFilaClientes,

          async (data: any) => {
            const resultado = dataEventoAcaoClienteSchema.safeParse(data);
            if (!resultado.success) {
              throw new Error("Evento recebido inválido.");
            }
            await handleEventoVoltarClientes(resultado.data);
          }
        );

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
