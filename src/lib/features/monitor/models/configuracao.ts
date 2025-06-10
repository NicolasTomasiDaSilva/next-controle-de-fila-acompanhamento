import { z } from "zod";
import { entidadeSchema } from "./entidade";

export const configuracaoSchema = entidadeSchema.extend({
  empresaId: z.string().uuid("ID da empresa inválido"),
  nomeDisplay: z
    .string()
    .trim()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(50, "Nome deve ter máximo 50 caracteres"),
  whatsappAtivo: z.boolean(),
  enderecoDisplay: z
    .string()
    .trim()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .refine((val) => val === null || val.length >= 3, {
      message: "Endereço deve ter no mínimo 3 caracteres",
    })
    .refine((val) => val === null || val.length <= 50, {
      message: "Endereço deve ter no máximo 50 caracteres",
    }),
  mensagemEntrada: z
    .string()
    .trim()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .refine((val) => val === null || val.length >= 1, {
      message: "Mensagem de entrada deve ter no mínimo 1 caractere",
    })
    .refine((val) => val === null || val.length <= 500, {
      message: "Mensagem de entrada deve ter no máximo 500 caracteres",
    }),
  mensagemChamada: z
    .string()
    .trim()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .refine((val) => val === null || val.length >= 1, {
      message: "Mensagem de chamada deve ter no mínimo 1 caractere",
    })
    .refine((val) => val === null || val.length <= 500, {
      message: "Mensagem de chamada deve ter no máximo 500 caracteres",
    }),
  mensagemRemovido: z
    .string()
    .trim()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .refine((val) => val === null || val.length >= 1, {
      message: "Mensagem de removido deve ter no mínimo 1 caractere",
    })
    .refine((val) => val === null || val.length <= 500, {
      message: "Mensagem de removido deve ter no máximo 500 caracteres",
    }),
  logoUrl: z
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .refine(
      (val) =>
        val === null ||
        val === undefined ||
        z.string().url().safeParse(val).success,
      {
        message: "URL inválida",
      }
    ),
  corPrimaria: z.string().trim(),
  corSobreposicao: z.string().trim(),
});

export type Configuracao = z.infer<typeof configuracaoSchema>;
