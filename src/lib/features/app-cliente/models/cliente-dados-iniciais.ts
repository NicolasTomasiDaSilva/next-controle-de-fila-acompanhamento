import { z } from "zod";
import { clienteSchema } from "../../monitor/models/cliente";
import { configuracaoSchema } from "../../monitor/models/configuracao";
import { filaSchema } from "../../monitor/models/fila";

export const dadosIniciaisClienteSchema = z.object({
  cliente: clienteSchema.pick({
    status: true,
    posicao: true,
    dataHoraChamada: true,
    dataHoraCriado: true,
  }),
  configuracao: configuracaoSchema.pick({
    nomeDisplay: true,
    enderecoDisplay: true,
    logoUrl: true,
    corPrimaria: true,
    corSobreposicao: true,
  }),
  fila: filaSchema.pick({
    tempoMedioEspera: true,
  }),
});

export type DadosIniciaisClienteDTO = z.infer<
  typeof dadosIniciaisClienteSchema
>;
