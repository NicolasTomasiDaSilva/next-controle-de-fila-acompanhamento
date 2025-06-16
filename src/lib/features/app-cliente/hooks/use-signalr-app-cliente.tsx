import { useContext, useEffect, useMemo, useRef } from "react";

import { StatusEnum } from "@/lib/enums/status-enum";
import { HubConnection } from "@microsoft/signalr";
import { connectToHub } from "@/lib/signalr/client";
import { eventosHubMonitor } from "@/constantes/eventos-hub-monitor";
import { toast } from "sonner";

import { eventosHubAppCliente } from "@/constantes/eventos-hub-app-cliente";
import {
  ClienteFinalDTO,
  clienteFinalSchema,
} from "../models/cliente-dados-iniciais";

interface useSignalrFilaProps {
  hash: string;
  handleEventoAtualizarCliente: (data: ClienteFinalDTO) => Promise<void>;
}
export function useSignalrAppCliente({
  hash,
  handleEventoAtualizarCliente,
}: useSignalrFilaProps) {
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    async function startConnection({ hash }: { hash: string }) {
      try {
        const connection = await connectToHub({
          queryParams: { hash: hash as string },
          withoutAccessToken: true,
        });
        connectionRef.current = connection;

        connection.on(
          eventosHubAppCliente.AtualizarCliente,

          async (data: any) => {
            const resultado = clienteFinalSchema.safeParse(data.cliente);

            if (!resultado.success) {
              throw new Error("Evento recebido inválido.");
            }

            await handleEventoAtualizarCliente(resultado.data);
          }
        );

        connection.onclose((error) => {
          if (error) {
            toast.error("Erro de conexão.");
          }
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

    startConnection({ hash });

    return () => {
      if (connectionRef.current) {
        connectionRef.current.off(eventosHubAppCliente.AtualizarCliente);
        connectionRef.current.stop();
      }
    };
  }, []);
}
