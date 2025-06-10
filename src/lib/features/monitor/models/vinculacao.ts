import { z } from "zod";
import { entidadeSchema } from "./entidade";

export const vinculacaoSchema = entidadeSchema.extend({
  idVinculacao: z.string().uuid("ID da vinculação inválido"),
  empresaId: z.string().uuid("ID da empresa inválido"),
  filaId: z.string().uuid("ID da fila inválido"),
  observacao: z
    .string()
    .trim()
    .max(20, "Observação deve ter no máximo 20 caracteres")
    .transform((val) => (val === "" ? null : val))
    .nullable(),
});

export type Vinculacao = z.infer<typeof vinculacaoSchema>;
