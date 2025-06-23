import React, { useEffect, useRef, useState } from "react";

import { toast } from "sonner";
import { HubConnection } from "@microsoft/signalr";
import { connectToHub } from "@/lib/signalr/signalr";
import { eventosHubMonitor } from "@/lib/constants/eventos-hub-monitor";
import { AuthTokens, authTokensSchema } from "../models/auth-tokens";
import { autenticacaoService } from "../services/autenticacao-service";
import { useRouter } from "next/navigation";

export function useSignalrLogin(idVinculacao: string | null) {
  const router = useRouter();
  const connectionRef = useRef<HubConnection | null>(null);
  const isReconnecting = useRef(false);

  useEffect(() => {
    if (!idVinculacao) {
      return;
    }

    let connection: HubConnection;

    async function startConnection() {
      try {
        if (connectionRef.current) {
          await connectionRef.current.stop();
        }

        connection = await connectToHub({
          queryParams: { idVinculacao: idVinculacao as string },
          withoutAccessToken: true,
        });
        connectionRef.current = connection;

        connection.onclose((error) => {
          if (isReconnecting.current) {
            toast.error("Conexão perdida. Não foi possível reconectar.", {
              duration: Infinity,
            });
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

        connection.on(eventosHubMonitor.Vinculado, handleEventoVinculado);

        await connection.start();
      } catch (error) {
        toast.error("Erro ao iniciar conexão.");
      }
    }

    startConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.off(eventosHubMonitor.Vinculado);
        connectionRef.current.stop();
      }
    };
  }, [idVinculacao]);

  async function handleEventoVinculado(data: any) {
    try {
      const result = authTokensSchema.safeParse(data);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      const tokens: AuthTokens = result.data;
      await autenticacaoService.login(tokens);
      router.push("/monitor");
    } catch (error) {
      toast.error("Erro ao vincular.");
      await autenticacaoService.logout();
      router.push("/monitor/login");
    }
  }
}
