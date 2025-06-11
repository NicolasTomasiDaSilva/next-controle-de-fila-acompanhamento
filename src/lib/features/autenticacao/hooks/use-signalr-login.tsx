import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";

import LogoCervantes from "@/assets/images/logo-cervantes.jpg";
import Image from "next/image";
import Link from "next/link";
import { empresaSchema } from "../../monitor/models/empresa";

import z, { set } from "zod";
import { formatarCpfCnpj } from "@/lib/utils/cpf-cnpj-utils";
import { cpfCnpjSchema } from "../../shared/models/values";
import { vinculacaoService } from "../../monitor/services/vinculacao-service";
import { toast } from "sonner";
import { HubConnection } from "@microsoft/signalr";
import { connectToHub } from "@/lib/signalr/client";
import { eventosHubMonitor } from "@/constantes/eventos-hub-monitor";
import { AuthTokens, authTokensSchema } from "../models/auth-tokens";
import { autenticacaoService } from "../services/autenticacao-service";
import { useRouter } from "next/navigation";

export function useSignalrLogin(idVinculacao: string | null) {
  const router = useRouter();

  useEffect(() => {
    if (!idVinculacao) {
      return;
    }

    let connection: HubConnection;
    let isMounted = true;

    async function startConnection() {
      try {
        if (!isMounted) {
          return;
        }
        connection = await connectToHub({
          queryParams: { idVinculacao: idVinculacao as string },
          withoutAccessToken: true,
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

        connection.on(eventosHubMonitor.Vinculado, async (data) => {
          const result = authTokensSchema.safeParse(data);
          if (!result.success) {
            throw new Error(result.error.message);
          }
          const tokens: AuthTokens = result.data;
          await autenticacaoService.login(tokens);
          router.push("/monitor");
        });

        await connection.start();
      } catch (error) {
        toast.error("Erro ao fazer vinculação.");
        await autenticacaoService.logout();
        router.push("/monitor/login");
      }
    }

    startConnection();

    return () => {
      isMounted = false;
      if (connection) {
        connection.stop();
      }
    };
  }, [idVinculacao]);
}
