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
  const isReconnecting = useRef(false);

  useEffect(() => {
    async function startConnection({ hash }: { hash: string }) {
      try {
        if (connectionRef.current) {
          await connectionRef.current.stop();
        }
        const connection = await connectToHub({
          queryParams: { hash: hash as string },
          withoutAccessToken: true,
        });
        connectionRef.current = connection;

        connection.onclose((error) => {
          if (isReconnecting.current) {
            toast.error("Conexão perdida. Não foi possível reconectar.");
          }
        });

        connection.onreconnecting(() => {
          isReconnecting.current = true;
          toast.warning("Tentando se reconectar...");
        });
        connection.onreconnected(() => {
          isReconnecting.current = false;
          toast.success("Reconectado com sucesso!");
        });

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

        await connection.start();
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
