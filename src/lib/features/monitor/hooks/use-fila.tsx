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
import { useSom } from "../../shared/hooks/use-som";

export function useFila() {
  const context = useContext(FilaContext);
  if (context === undefined) {
    throw new Error("useFila must be used within a FilaProvider");
  }

  const { fila, setFila } = context;
  const { chamarNome } = useSom();

  const nomesParaFalar = useRef<string[]>([]);
  const falando = useRef(false);

  async function processarFilaDeFala() {
    if (falando.current) return; // já está falando

    const proximoNome = nomesParaFalar.current.shift();
    if (!proximoNome) return; // fila vazia

    falando.current = true;
    try {
      await chamarNome(proximoNome);
    } catch (error) {
      console.error("Erro ao falar nome:", error);
    } finally {
      falando.current = false;
      // Processa próximo da fila
      if (nomesParaFalar.current.length > 0) {
        processarFilaDeFala();
      }
    }
  }

  // Função para enfileirar nome e iniciar processamento
  function enqueueFalarNome(nome: string) {
    nomesParaFalar.current.push(nome);
    processarFilaDeFala();
  }

  const ultimosChamados = useMemo(() => {
    const chamados = fila.clientes.filter(
      (cliente) => cliente.status === StatusEnum.Chamado
    );

    return ordenarPorDataHora<Cliente>(chamados, "dataHoraChamada", "desc");
  }, [fila.clientes]);

  async function handleEventoVoltarClientes(data: DataEventoAcaoClienteDTO) {
    const { fila: filaAtualizada } = data;
    setFila(filaAtualizada);
  }

  async function handleEventoChamarClientes(data: DataEventoAcaoClienteDTO) {
    const { fila: filaAtualizada, clientesAcao: clientesChamados } = data;
    setFila(filaAtualizada);
    const cliente: Cliente = clientesChamados[0];
    if (cliente) {
      enqueueFalarNome(cliente.nome);
    }
  }

  return {
    handleEventoChamarClientes,
    handleEventoVoltarClientes,
    fila,
    setFila,
    ultimosChamados,
  };
}
