import { z } from "zod";

export const entidadeSchema = z.object({
  id: z.string().uuid(),
  dataHoraCriado: z.coerce.date(),
  dataHoraAlterado: z.coerce.date(),
  dataHoraDeletado: z.coerce.date().nullable(),
});

export type Entidade = z.infer<typeof entidadeSchema>;
