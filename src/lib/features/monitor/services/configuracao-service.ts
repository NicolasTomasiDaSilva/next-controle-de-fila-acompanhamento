import { api } from "@/lib/api/api";
import { Configuracao, configuracaoSchema } from "../models/configuracao";

export const configuracaoService = {
  async obterConfiguracao(): Promise<Configuracao> {
    return (await api.get<Configuracao>(`/configuracoes`, undefined, {
      schema: configuracaoSchema,
    })) as Configuracao;
  },
};
