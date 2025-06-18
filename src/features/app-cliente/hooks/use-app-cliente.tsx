import { useMemo, useRef, useState } from "react";
import {
  ClienteFinalDTO,
  DadosIniciaisClienteDTO,
} from "../models/cliente-dados-iniciais";
import { Fila } from "../../monitor/models/fila";
import { clienteService } from "../services/cliente-service";
import { toast } from "sonner";

import { StatusEnum } from "@/lib/enums/status-enum";
import { useSom } from "../../shared/hooks/use-som";

export default function useAppCliente({
  dadosIniciasCliente,
  hash,
}: {
  dadosIniciasCliente: DadosIniciaisClienteDTO;
  hash: string;
}) {
  const { emitirSom } = useSom();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [versaoCliente, setVersaoCliente] = useState(0);
  const [cliente, setCliente] = useState(dadosIniciasCliente.cliente);
  const [fila, setFila] = useState(dadosIniciasCliente.fila);
  const [configuracao, setConfiguracao] = useState(
    dadosIniciasCliente.configuracao
  );
  const posicaoAnteriorRef = useRef<number | null>(cliente.posicao);
  const statusAnteriorRef = useRef<StatusEnum | null>(cliente.status);

  async function handleEventoAtualizarCliente(
    clienteAtualizado: ClienteFinalDTO
  ) {
    const posicaoAntiga = posicaoAnteriorRef.current;
    const statusAntigo = statusAnteriorRef.current;

    posicaoAnteriorRef.current = clienteAtualizado.posicao;
    statusAnteriorRef.current = clienteAtualizado.status;

    setCliente(clienteAtualizado);
    setVersaoCliente(versaoCliente + 1);

    if (statusAntigo !== clienteAtualizado.status) {
      switch (clienteAtualizado.status) {
        case StatusEnum.Chamado:
          await emitirSom("chamado");
          break;
        case StatusEnum.Removido:
          await emitirSom("removido");
          break;
        default:
          break;
      }
    } else if (
      posicaoAntiga !== clienteAtualizado.posicao &&
      posicaoAntiga &&
      clienteAtualizado.posicao
    ) {
      if (clienteAtualizado.posicao < posicaoAntiga) {
        await emitirSom("subiu");
      } else {
        await emitirSom("desceu");
      }
    }
  }

  async function handleDesisitir() {
    try {
      const clienteAtualizado = await clienteService.desistir({ hash });
      setCliente(clienteAtualizado);
      setVersaoCliente(versaoCliente + 1);
    } catch (error) {
      toast.error("Erro ao desistir.");
    }
  }

  return {
    handleEventoAtualizarCliente,
    cliente,
    fila,
    configuracao,
    versaoCliente,
    handleDesisitir,
  };
}
