import z from "zod";
import { configuracaoSchema } from "./configuracao";

export const dataEventoAtualizarConfiguracaoSchema = z.object({
  configuracao: configuracaoSchema,
});

export type dataEventoAtualizarConfiguracaoDTO = z.infer<
  typeof dataEventoAtualizarConfiguracaoSchema
>;
