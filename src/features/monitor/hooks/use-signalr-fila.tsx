import { useContext, useEffect, useMemo, useRef } from "react";
import { FilaContext } from "../context/fila-context";
import { StatusEnum } from "@/lib/enums/status-enum";
import { HubConnection } from "@microsoft/signalr";
import { connectToHub } from "@/lib/signalr/signalr";
import { eventosHubMonitor } from "@/constantes/eventos-hub-monitor";
import { toast } from "sonner";
import { useFila } from "./use-fila";
import {
  DataEventoAcaoClienteDTO,
  dataEventoAcaoClienteSchema,
} from "../models/data-evento-acao-admin";
import { Configuracao, configuracaoSchema } from "../models/configuracao";
import {
  dataEventoAtualizarConfiguracaoDTO,
  dataEventoAtualizarConfiguracaoSchema,
} from "../models/data-evento-atualizar-configuracao";

interface useSignalrFilaProps {
  handleEventoChamarClientes: (data: DataEventoAcaoClienteDTO) => Promise<void>;
  handleEventoVoltarClientes: (data: DataEventoAcaoClienteDTO) => Promise<void>;
  handleEventoAtualizarConfiguracao: (
    data: dataEventoAtualizarConfiguracaoDTO
  ) => Promise<void>;
}
export function useSignalrFila({
  handleEventoChamarClientes,
  handleEventoVoltarClientes,
  handleEventoAtualizarConfiguracao,
}: useSignalrFilaProps) {
  const connectionRef = useRef<HubConnection | null>(null);
  const isReconnecting = useRef(false);

  useEffect(() => {
    async function startConnection() {
      try {
        if (connectionRef.current) {
          await connectionRef.current.stop();
        }

        const connection = await connectToHub();
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

        connection.on(eventosHubMonitor.ChamarClientes, async (data) => {
          const resultado = dataEventoAcaoClienteSchema.safeParse(data);
          if (!resultado.success) {
            throw new Error("Evento recebido inválido.");
          }
          await handleEventoChamarClientes(resultado.data);
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
        connection.on(
          eventosHubMonitor.AtualizarConfiguracoes,
          async (data: any) => {
            const resultado =
              dataEventoAtualizarConfiguracaoSchema.safeParse(data);
            if (!resultado.success) {
              throw new Error("Evento recebido inválido.");
            }
            await handleEventoAtualizarConfiguracao(resultado.data);
          }
        );

        await connection.start();
      } catch (error) {
        toast.error("Erro ao iniciar conexão.");
      }
    }

    startConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.off(eventosHubMonitor.VoltarParaFilaClientes);
        connectionRef.current.off(eventosHubMonitor.ChamarClientes);
        connectionRef.current.stop();
      }
    };
  }, []);
}
