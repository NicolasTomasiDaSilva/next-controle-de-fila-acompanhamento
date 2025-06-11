import z from "zod";
import { clienteSchema } from "./cliente";
import { filaSchema } from "./fila";
import { AcoesAdminEnum } from "@/lib/enums/acoes-admin-enum";
export const AcoesAdminEnumSchema = z.nativeEnum(AcoesAdminEnum);
export const dataEventoAcaoClienteSchema = z.object({
  acao: AcoesAdminEnumSchema,
  fila: filaSchema,
  clientesAcao: clienteSchema.array(),
});

export type DataEventoAcaoClienteDTO = z.infer<
  typeof dataEventoAcaoClienteSchema
>;
