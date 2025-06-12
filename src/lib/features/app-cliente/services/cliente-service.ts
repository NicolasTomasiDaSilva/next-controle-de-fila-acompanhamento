import { api } from "@/lib/api/api";

import axios from "axios";
import {
  DadosIniciaisClienteDTO,
  dadosIniciaisClienteSchema,
} from "../models/cliente-dados-iniciais";

export const clienteService = {
  async pegarDadosInicias({
    hash,
  }: {
    hash: string;
  }): Promise<DadosIniciaisClienteDTO> {
    try {
      const params = new Map<string, string | string[]>();
      params.set("hash", hash);
      return (await api.get<DadosIniciaisClienteDTO>(
        "/clientes/dados-iniciais",
        params,
        {
          schema: dadosIniciaisClienteSchema,
          withoutRetry: true,
        }
      )) as DadosIniciaisClienteDTO;
    } catch (error: any) {
      throw error;
    }
  },
};
