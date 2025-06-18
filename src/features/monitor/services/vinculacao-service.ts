import { api } from "@/lib/axios/axios";
import {
  ResponseGerarCodigoVinculacaoDTO,
  responseGerarCodigoVinculacaoSchema,
} from "../../autenticacao/models/response-gerar-codigo-vinculacao";

export const vinculacaoService = {
  async gerarCodigoVinculacao(
    cpfCnpj: string
  ): Promise<ResponseGerarCodigoVinculacaoDTO> {
    try {
      const params = new Map<string, string | string[]>();
      params.set("cpfCnpj", cpfCnpj);
      return (await api.get<ResponseGerarCodigoVinculacaoDTO>(
        `/vinculacoes/codigo`,
        params,
        {
          schema: responseGerarCodigoVinculacaoSchema,
        }
      )) as ResponseGerarCodigoVinculacaoDTO;
    } catch (error: any) {
      throw error;
    }
  },
};
