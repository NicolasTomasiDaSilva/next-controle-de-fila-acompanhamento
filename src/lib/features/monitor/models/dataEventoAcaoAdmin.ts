import z from "zod";
import { clienteSchema } from "./cliente";

export const dataEventoAcaoAdminSchema = z.object({
  clientes: clienteSchema.array(),
  clientesAcao: clienteSchema.array(),
});

export type DataEventoAcaoAdmin = z.infer<typeof dataEventoAcaoAdminSchema>;
