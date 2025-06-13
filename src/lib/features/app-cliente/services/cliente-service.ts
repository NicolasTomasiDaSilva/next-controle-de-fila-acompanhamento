import { api } from "@/lib/api/api";

import axios from "axios";
import {
  ClienteFinalDTO,
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
  async desistir({ hash }: { hash: string }): Promise<ClienteFinalDTO> {
    try {
      return (await api.post<ClienteFinalDTO, { hash: string }>(
        "/clientes/desistir",
        { hash },
        {
          withoutRetry: true,
        }
      )) as ClienteFinalDTO;
    } catch (error: any) {
      throw error;
    }
  },
};
