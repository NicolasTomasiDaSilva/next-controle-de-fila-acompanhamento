import { z } from "zod";
import { configuracaoSchema } from "./configuracao";
import { entidadeSchema } from "./entidade";
import { filaSchema } from "./fila";
import { vinculacaoSchema } from "./vinculacao";
import { isCPF, isCNPJ } from "brazilian-values";
import { cpfCnpjSchema } from "../../shared/models/values";

export const empresaSchema = entidadeSchema.extend({
  nome: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  cpfCnpj: cpfCnpjSchema,
  email: z.string().trim().email("E-mail inválido").toLowerCase(),
  filas: z.array(filaSchema),
  vinculacoes: z.array(vinculacaoSchema),
  configuracao: configuracaoSchema,
});

export type Empresa = z.infer<typeof empresaSchema>;
