import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FilaContext } from "../context/fila-context";
import { StatusEnum } from "@/lib/enums/status-enum";
import { HubConnection } from "@microsoft/signalr";
import { connectToHub } from "@/lib/signalr/client";
import { eventosHubMonitor } from "@/constantes/eventos-hub-monitor";
import { toast } from "sonner";
import {
  DataEventoAcaoClienteDTO,
  dataEventoAcaoClienteSchema,
} from "../models/data-evento-acao-admin";
import { Cliente } from "../models/cliente";

export function useFila() {
  const context = useContext(FilaContext);
  if (context === undefined) {
    throw new Error("useFila must be used within a FilaProvider");
  }

  const { fila, setFila } = context;

  const filaDeChamada = useRef<Cliente[]>([]);

  async function handleEventoChamarClientes(data: any) {
    const resultado = dataEventoAcaoClienteSchema.safeParse(data);
    if (!resultado.success) {
      throw new Error("Evento recebido inválido.");
    }
    const { clientesAcao } = resultado.data;
    filaDeChamada.current = [...clientesAcao, ...filaDeChamada.current];
  }

  return {
    fila,
    setFila,
  };
}
