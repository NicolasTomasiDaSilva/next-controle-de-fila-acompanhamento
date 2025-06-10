import { z } from "zod";
import { entidadeSchema } from "./entidade";
import { StatusEnum } from "@/lib/enums/status-enum";

export const statusEnumSchema = z.nativeEnum(StatusEnum);

export const clienteSchema = entidadeSchema.extend({
  filaId: z.string().uuid("ID da fila inválido"),
  nome: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  observacao: z
    .string()
    .trim()
    .max(30, "Observação deve ter no máximo 30 caracteres")
    .transform((val) => (val === "" ? null : val))
    .nullable(),
  telefone: z
    .string()
    .trim()
    .transform((val) => (val === "" ? null : val))
    .refine((val) => val === null || (val.length >= 10 && val.length <= 11), {
      message: "Telefone deve ter entre 10 e 11 caracteres",
    })
    .nullable(),
  hash: z.string().min(1),
  posicao: z.number().nullable(),
  status: statusEnumSchema,
  dataHoraOrdenacao: z.coerce.date(),
  dataHoraChamada: z.coerce.date().nullable(),
});

export type Cliente = z.infer<typeof clienteSchema>;
