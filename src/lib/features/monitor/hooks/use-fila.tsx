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

  async function handleEventoVoltarClientes(data: any) {
    const resultado = dataEventoAcaoClienteSchema.safeParse(data);
    if (!resultado.success) {
      throw new Error("Evento recebido inválido.");
    }

    const { clientesAcao } = resultado.data;
    const idsParaVoltar = new Set(clientesAcao.map((c) => c.id));

    // Remove os clientes da filaDeChamada
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

  async function handleEventoChamarClientes(data: any) {
    const resultado = dataEventoAcaoClienteSchema.safeParse(data);
    if (!resultado.success) {
      throw new Error("Evento recebido inválido.");
    }
    const { clientesAcao } = resultado.data;

    const novaFila = [...filaDeChamada.current, ...clientesAcao];

    filaDeChamada.current = ordenarPorDataHora<Cliente>(
      novaFila,
      "dataHoraChamada",
      "asc"
    );
  }

  function chamarProximoCliente() {
    if (filaDeChamada.current.length === 0) {
      console.log("Nenhum cliente para chamar.");
      return;
    }

    const proximoCliente = filaDeChamada.current[0];

    // Remove ele da fila
    filaDeChamada.current = filaDeChamada.current.slice(1);

    // Aqui você faz o que precisa com o cliente chamado, ex:
    console.log("Chamando cliente:", proximoCliente);

    // Atualiza o estado ou dispara evento para refletir a fila atualizada

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
    }, 5000); // a cada 10 segundos

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
