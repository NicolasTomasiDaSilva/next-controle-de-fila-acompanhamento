import { z } from "zod";
import { configuracaoSchema } from "./configuracao";
import { entidadeSchema } from "./entidade";

import { cpfCnpjSchema, texto } from "./values";
import { filaSchema } from "./fila";

export const empresaSchema = entidadeSchema.extend({
  nome: texto({ campo: "Nome da Empresa", min: 1, max: 50 }),
  cpfCnpj: cpfCnpjSchema,
  email: z.string().trim().email("E-mail inválido").toLowerCase(),
  filas: z.array(filaSchema),
  configuracao: configuracaoSchema,
});

export type Empresa = z.infer<typeof empresaSchema>;
