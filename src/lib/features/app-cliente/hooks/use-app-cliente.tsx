import { useMemo, useState } from "react";
import {
  ClienteFinalDTO,
  DadosIniciaisClienteDTO,
} from "../models/cliente-dados-iniciais";
import { Fila } from "../../monitor/models/fila";
import { clienteService } from "../services/cliente-service";
import { toast } from "sonner";

export default function useAppCliente({
  dadosIniciasCliente,
  hash,
}: {
  dadosIniciasCliente: DadosIniciaisClienteDTO;
  hash: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [versaoCliente, setVersaoCliente] = useState(0);
  const [cliente, setCliente] = useState(dadosIniciasCliente.cliente);
  const [fila, setFila] = useState(dadosIniciasCliente.fila);
  const [configuracao, setConfiguracao] = useState(
    dadosIniciasCliente.configuracao
  );
  async function handleEventoAtualizarCliente(
    clienteAtualizado: ClienteFinalDTO
  ) {
    setCliente(clienteAtualizado);
    setVersaoCliente(versaoCliente + 1);
  }
  async function handleDesisitir() {
    try {
      const clienteAtualizado = await clienteService.desistir({ hash });
      setCliente(clienteAtualizado);
      setVersaoCliente(versaoCliente + 1);
      toast.success("Desistido com sucesso!");
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
