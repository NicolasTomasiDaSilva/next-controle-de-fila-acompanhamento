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
import { ordenarPorDataHora } from "@/lib/utils/ordenacao-utils";
import { falarNome } from "@/lib/utils/falar-utils";

export function useFila() {
  const context = useContext(FilaContext);
  if (context === undefined) {
    throw new Error("useFila must be used within a FilaProvider");
  }

  const { fila, setFila } = context;

  const ultimosChamados = useMemo(() => {
    const chamados = fila.clientes.filter(
      (cliente) => cliente.status === StatusEnum.Chamado
    );

    return ordenarPorDataHora<Cliente>(chamados, "dataHoraChamada", "desc");
  }, [fila.clientes]);

  const filaDeChamada = useRef<Cliente[]>([]);

  async function handleEventoVoltarClientes(data: DataEventoAcaoClienteDTO) {
    const { clientesAcao } = data;
    const idsParaVoltar = new Set(clientesAcao.map((c) => c.id));

    filaDeChamada.current = filaDeChamada.current.filter(
      (cliente) => !idsParaVoltar.has(cliente.id)
    );
    setFila((filaAnterior) => ({
      ...filaAnterior,
      clientes: filaAnterior.clientes.filter(
        (cliente) => !idsParaVoltar.has(cliente.id)
      ),
    }));
  }

  async function handleEventoChamarClientes(data: DataEventoAcaoClienteDTO) {
    const { clientesAcao } = data;
    const novaFila = [...filaDeChamada.current, ...clientesAcao];

    filaDeChamada.current = ordenarPorDataHora<Cliente>(
      novaFila,
      "dataHoraChamada",
      "asc"
    );
  }

  function chamarProximoCliente() {
    if (filaDeChamada.current.length === 0) {
      return;
    }

    const proximoCliente = filaDeChamada.current[0];

    filaDeChamada.current = filaDeChamada.current.slice(1);

    falarNome(proximoCliente.nome);
    setFila((filaAnterior) => {
      return {
        ...filaAnterior,
        clientes: [...filaAnterior.clientes, proximoCliente],
      };
    });
  }

  useEffect(() => {
    const intervalo = setInterval(() => {
      chamarProximoCliente();
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  return {
    handleEventoChamarClientes,
    handleEventoVoltarClientes,
    fila,
    setFila,
    ultimosChamados,
  };
}
