import { Entidade, entidadeSchema } from "./entidade";
import { z } from "zod";
import { texto } from "./values";
import { text } from "stream/consumers";

export const configuracaoSchema = entidadeSchema.extend({
  empresaId: z.string().uuid(),
  nomeDisplay: texto({ campo: "Nome Fantasia", min: 1, max: 50 }),
  whatsappAtivo: z.boolean(),
  enderecoDisplay: texto({
    campo: "Endereço",
    min: 1,
    max: 50,
    transformarEmNull: true,
  }),
  logoUrl: z
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .superRefine((val, ctx) => {
      if (val !== null) {
        const result = z.string().url().safeParse(val);
        if (!result.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "URL inválida",
          });
        }
      }
    }),
  mensagemEntrada: texto({
    campo: "Mensagem de Entrada",
    min: 1,
    max: 500,
    transformarEmNull: true,
  }),
  mensagemChamada: texto({
    campo: "Mensagem de Chamada",
    min: 1,
    max: 500,
    transformarEmNull: true,
  }),
  mensagemRemovido: texto({
    campo: "Mensagem de Remoção",
    min: 1,
    max: 500,
    transformarEmNull: true,
  }),
  corPrimaria: texto({ campo: "Cor Primária", min: 4, max: 9 }),
  corSobreposicao: texto({ campo: "Cor Sobreposição", min: 4, max: 9 }),
});

export type Configuracao = z.infer<typeof configuracaoSchema>;
