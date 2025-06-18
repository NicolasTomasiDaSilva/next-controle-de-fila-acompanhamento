import { api } from "@/lib/axios/axios";
import { Fila, filaSchema } from "../models/fila";

export const filaService = {
  async obterFila(): Promise<Fila> {
    return (await api.get<Fila>(`/filas`, undefined, {
      schema: filaSchema,
    })) as Fila;
  },
};
