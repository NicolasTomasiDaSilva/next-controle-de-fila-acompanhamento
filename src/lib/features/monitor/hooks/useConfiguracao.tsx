import { useContext } from "react";
import { ConfiguracaoContext } from "../context/configuracao-context";

export function useConfiguracao() {
  const context = useContext(ConfiguracaoContext);
  if (context === undefined) {
    throw new Error(
      "useConfiguracao must be used within a ConfiguracaoProvider"
    );
  }
  return {
    configuracao: context.configuracao,
    setConfiguracao: context.setConfiguracao,
  };
}
