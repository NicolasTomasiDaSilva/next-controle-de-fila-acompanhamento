"use client";

import { createContext, useState, ReactNode } from "react";
import { Configuracao } from "../models/configuracao";

type ConfiguracaoContextType = {
  configuracao: Configuracao;
  setConfiguracao: (configuracao: Configuracao) => void;
};

export const ConfiguracaoContext = createContext<
  ConfiguracaoContextType | undefined
>(undefined);

interface ConfiguracaoProviderProps {
  configuracaoInicial: Configuracao;
  children: ReactNode;
}
export const ConfiguracaoProvider = ({
  configuracaoInicial,
  children,
}: ConfiguracaoProviderProps) => {
  const [configuracao, setConfiguracao] =
    useState<Configuracao>(configuracaoInicial);

  return (
    <ConfiguracaoContext.Provider value={{ configuracao, setConfiguracao }}>
      {children}
    </ConfiguracaoContext.Provider>
  );
};
