import { useContext } from "react";
import { ConfiguracaoContext } from "../context/configuracao-context";
import { dataEventoAtualizarConfiguracaoDTO } from "../models/data-evento-atualizar-configuracao";
import { toast } from "sonner";

export function useConfiguracao() {
  const context = useContext(ConfiguracaoContext);
  if (context === undefined) {
    throw new Error(
      "useConfiguracao must be used within a ConfiguracaoProvider"
    );
  }
  const { configuracao, setConfiguracao } = context;

  async function handleEventoAtualizarConfiguracao(
    data: dataEventoAtualizarConfiguracaoDTO
  ) {
    try {
      const { configuracao } = data;
      setConfiguracao(configuracao);
    } catch (error) {
      toast.error("Erro ao atualizar configurações.");
    }
  }

  return { configuracao, handleEventoAtualizarConfiguracao };
}
