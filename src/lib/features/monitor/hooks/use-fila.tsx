import { useContext, useEffect, useMemo } from "react";
import { FilaContext } from "../context/fila-context";
import { StatusEnum } from "@/lib/enums/status-enum";
import { HubConnection } from "@microsoft/signalr";
import { connectToHub } from "@/lib/signalr/client";
import { eventosHubMonitor } from "@/constantes/eventos-hub-monitor";
import { toast } from "sonner";

export function useFila() {
  const context = useContext(FilaContext);
  if (context === undefined) {
    throw new Error("useFila must be used within a FilaProvider");
  }
  const { fila, setFila } = context;

  const ultimosClientesChamados = useMemo(() => {
    if (!fila?.clientes) return [];
    return fila.clientes
      .filter(
        (cliente) =>
          cliente.status === StatusEnum.Chamado ||
          cliente.status === StatusEnum.Atendido
      )
      .sort(
        (a, b) =>
          new Date(b.dataHoraChamada!).getTime() -
          new Date(a.dataHoraChamada!).getTime()
      );
  }, [fila]);

  return {
    fila,
    setFila,
    ultimosClientesChamados,
  };
}
