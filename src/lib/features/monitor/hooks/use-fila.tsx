import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FilaContext } from "../context/fila-context";
import { StatusEnum } from "@/lib/enums/status-enum";
import { HubConnection } from "@microsoft/signalr";
import { connectToHub } from "@/lib/signalr/client";
import { eventosHubMonitor } from "@/constantes/eventos-hub-monitor";
import { toast } from "sonner";
import {
  DataEventoAcaoAdmin,
  dataEventoAcaoAdminSchema,
} from "../models/dataEventoAcaoAdmin";
import { Cliente } from "../models/cliente";

export function useFila() {
  const context = useContext(FilaContext);
  if (context === undefined) {
    throw new Error("useFila must be used within a FilaProvider");
  }

  const { fila, setFila, ultimosClientesChamados, setUltimosClientesChamados } =
    context;

  // Inicia loop a cada 10s
  useEffect(() => {
    const intervalo = setInterval(() => {
      chamarProximoCliente();
    }, 1); // 10 segundos

    return () => clearInterval(intervalo);
  }, []);

  const filaEsperaChamada = useRef<Cliente[]>([]);

  async function handleEventoChamarClientes(data: any) {
    const result = dataEventoAcaoAdminSchema.safeParse(data);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    const parsed: DataEventoAcaoAdmin = result.data;
    const clientesChamados = parsed.clientesAcao
      .filter((cliente) => cliente.status === StatusEnum.Chamado)
      .sort(
        (a, b) =>
          new Date(b.dataHoraChamada!).getTime() -
          new Date(a.dataHoraChamada!).getTime()
      );
    filaEsperaChamada.current.push(...clientesChamados);
  }
  function chamarProximoCliente() {
    if (filaEsperaChamada.current.length === 0 || !fila) return;

    const proximo = filaEsperaChamada.current.shift();

    if (proximo) {
      setUltimosClientesChamados((anteriores) => [proximo, ...anteriores]);
    }
  }

  return {
    fila,
    setFila,
    ultimosClientesChamados,
    handleEventoChamarClientes,
  };
}
