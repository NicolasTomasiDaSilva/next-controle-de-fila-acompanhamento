import { z } from "zod";

import { empresaSchema } from "../../monitor/models/empresa";
import {
  codigoVinculacaoMonitorSchema,
  cpfCnpjSchema,
} from "../../shared/models/values";

export const responseGerarCodigoVinculacaoSchema = z.object({
  codigo: codigoVinculacaoMonitorSchema,
  cpfCnpj: cpfCnpjSchema,
  idVinculacao: z.string().uuid("ID da vinculação inválido"),
  dataExpiracao: z.coerce.date(),
  aplicativoVinculado: z.number(),
});

export type ResponseGerarCodigoVinculacaoDTO = z.infer<
  typeof responseGerarCodigoVinculacaoSchema
>;
