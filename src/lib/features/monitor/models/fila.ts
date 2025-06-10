import { z } from "zod";
import { clienteSchema } from "./cliente";
import { entidadeSchema } from "./entidade";

export const filaSchema = entidadeSchema.extend({
  empresaId: z.string().uuid("ID da empresa inválido"),
  setor: z.string().trim().nullable(),
  tempoMedioEspera: z.string().nullable(),
  clientes: z.array(clienteSchema),
});

export type Fila = z.infer<typeof filaSchema>;
