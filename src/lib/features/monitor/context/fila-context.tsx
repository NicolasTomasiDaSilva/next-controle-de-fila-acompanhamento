"use client";

import { createContext, useState, ReactNode } from "react";
import { Configuracao } from "../models/configuracao";
import { Fila } from "../models/fila";
import { Cliente } from "../models/cliente";
import { StatusEnum } from "@/lib/enums/status-enum";

type FilaContextType = {
  fila: Fila;
  setFila: (fila: Fila) => void;
  ultimosClientesChamados: Cliente[];
  setUltimosClientesChamados: React.Dispatch<React.SetStateAction<Cliente[]>>;
};

export const FilaContext = createContext<FilaContextType | undefined>(
  undefined
);

interface FilaProviderProps {
  filaInicial: Fila;
  children: ReactNode;
}
export const FilaProvider = ({ filaInicial, children }: FilaProviderProps) => {
  const [fila, setFila] = useState<Fila>(filaInicial);

  const [ultimosClientesChamados, setUltimosClientesChamados] = useState<
    Cliente[]
  >(
    fila.clientes
      .filter((cliente) => cliente.status === StatusEnum.Chamado)
      .sort(
        (a, b) =>
          new Date(b.dataHoraChamada!).getTime() -
          new Date(a.dataHoraChamada!).getTime()
      )
  );

  return (
    <FilaContext.Provider
      value={{
        fila,
        setFila,
        ultimosClientesChamados,
        setUltimosClientesChamados,
      }}
    >
      {children}
    </FilaContext.Provider>
  );
};
