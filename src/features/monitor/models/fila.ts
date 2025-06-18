import { z } from "zod";
import { entidadeSchema } from "./entidade";
import { clienteSchema } from "./cliente";

export const filaSchema = entidadeSchema.extend({
  empresaId: z.string().uuid(),
  setor: z.string().trim().nullable(),
  tempoMedioEspera: z.string().nullable(),
  clientes: z.array(clienteSchema),
});

export type Fila = z.infer<typeof filaSchema>;
